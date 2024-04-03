import Vue from "vue"
const state = {
	cartList: [],
	CartPagesInfo: {}
};

const getters = {
	// 检查商品是否存在于购物车中
	checkProductExists(state) {
		return function(skuId) {
			const pos = state.cartList.findIndex(item => item.skuId === skuId)
			return pos === -1 ? false : true;
		}
	},
	// 获取单个商品的购买数量
	getProductSkuNum(state) {
		return function(skuId) {
			const index = state.cartList.findIndex(item => item.skuId === skuId);
			return index !== -1 ? state.cartList[index].skuNum : 0;
		}
	},
	// 获取购物车商品信息列表
	getCartInfoList(state) {

		if(!state.CartPagesInfo.cartInfoList || (state.CartPagesInfo.cartInfoList.length ==0)){
			return false;
		}
		return state.CartPagesInfo.cartInfoList
	},

	// 判断是否全选
	isAllSelected(state) {
		let isAllSelected = true;
		state.CartPagesInfo.cartInfoList && state.CartPagesInfo.cartInfoList
			.forEach(carInfoItem => {
				if (carInfoItem.isChecked === 0) {
					isAllSelected = false;
					return false;
				}
			})
		return isAllSelected;
	},
	// 获取购物车价格信息
	getCartPriceInfo(state) {
		if (!state.CartPagesInfo.originalTotalAmount) {
			return {
				originalTotalAmount: 0,
			}
		}

		return {
			originalTotalAmount: state.CartPagesInfo.originalTotalAmount,
		}
	},
	// 确认选中购物车的数量
	getSelectedCount(state) {
		let count = 0;
	
		state.CartPagesInfo.cartInfoList && state.CartPagesInfo.cartInfoList
			.forEach(cartInfoItem => {
				if (cartInfoItem.isChecked === 1) {
					count += cartInfoItem.skuNum;
				}
			})
		return count;
	},
}

const mutations = {
	// 添加到购物车
	addShopMutation(state, payload) {
		state.cartList.push(payload);
	},
	// 获取的购物车列表
	getCartListMutation(state, payload) {
		state.cartList = payload;
	},
	// 修改购物车数量
	changeSkuNumMutation(state, payload) {
		// skuId为商品id
		// value为+1或者-1，操作的递增值
		// currentBuyNum为number-box组件当前商品购物车的操作值
		const {
			skuId,
			value,
			currentBuyNum
		} = payload
		const index = state.cartList.findIndex(item => item.skuId === skuId);
		// 如果当前购买数量小于1则删除该商品
		if (currentBuyNum < 1) {
			state.cartList.splice(index, 1)
		} else {
			state.cartList[index].skuNum += value
		}
	},
	// 删除购物车
	deleteShopMutation(state, payload) {
		// 删除cartList中的数据
		const cartListIndex = state.cartList.findIndex(item => item.skuId === payload);
		state.cartList.splice(cartListIndex, 1)
	},
	// 获取则购物车页面
	getCartPagesInfoMutation(state, payload) {

		state.CartPagesInfo = payload
		state.cartList = payload.cartInfoList;
	},

}
const actions = {
	// 添加到购物车
	async addShopAction({
		commit,
		state
	}, payload) {
		// 给对象添加响应式数据属性
		Vue.set(payload, 'skuNum', 1)
		Vue.set(payload, 'skuId', payload.id)
		Vue.set(payload, 'isChecked', 1)
		await this._vm.$u.api.getAddToCart({
			skuId: payload.id,
			skuNum: payload.skuNum,
		})
		commit('addShopMutation', payload)
	},

	// 修改购物车数量
	async changeSkuNumAction({
		commit,
		dispatch
	}, payload) {
		const {
			skuId,
			value,
			currentBuyNum,
			isCart
		} = payload;
		// 如果当前购买的数量小于1，则需要将该商品从购物车中删除，否则进行购物车数量的修改
		if (currentBuyNum < 1) {
			dispatch('deleteShopAction', payload)
		} else {
			await this._vm.$u.api.getAddToCart({
				skuId: skuId,
				skuNum: value,
			})
			commit('changeSkuNumMutation', payload)
		}
		
		// 通过isCart判断是否是在购物车里进行购物车数量的改变，
		// 如果是在购物车里进行数量变化，则需要重新获取数据
		if (isCart) dispatch('getCartPagesInfoAction')

	},
	
	// 删除购物车
	async deleteShopAction({
		commit,
		dispatch
	}, payload) {
		const {
			skuId,
			value,
			currentBuyNum,
			isCart
		} = payload;
		await this._vm.$u.api.deleteCart(skuId);
		
		// 删除时如果是在购物车列表操作，则需要重新获取数据
		if (isCart) await dispatch('getCartPagesInfoAction')
		await commit('deleteShopMutation', skuId)
	},
	
	// 获取购物车页面
	async getCartPagesInfoAction({
		commit
	}, payload) {
		let showLoading = false;
		if (payload) showLoading = true

		let result = await this._vm.$u.api.getCartPagesInfo({
			showLoading
		})
		commit('getCartPagesInfoMutation', result)
	},
	// 切换购物车商品的选中状态
	async changeCheckCartAction({
		commit,
		dispatch
	}, payload) {
		let result = await this._vm.$u.api.getCheckCart(payload)
		dispatch('getCartPagesInfoAction')
	},
	// 对所有购物车商品进行全选/反选
	async changeAllCheckCartAction({
		commit,
		dispatch
	}, payload) {
		let result = await this._vm.$u.api.getCheckAllCart(payload)
		dispatch('getCartPagesInfoAction')
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
