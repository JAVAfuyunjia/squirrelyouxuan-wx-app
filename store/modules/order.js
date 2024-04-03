import Vue from 'vue'
const state = {
	order: {}
};

const getters = {
	// 获取订单商品信息列表
	getCartInfoList(state) {
		return state.order.cartInfoList
	},
	// 获取提货点信息
	getUserAddressVo(state) {
		return state.order.userAddressVo
	},
	// 确认选中购物车的数量
	getSelectedCount(state) {
		let count = 0;
	
		state.order.cartInfoList && state.order.cartInfoList
			.forEach(cartInfoItem => {
				if (cartInfoItem.isChecked === 1) {
					count += cartInfoItem.skuNum;
				}
			})
		return count;
	},
	// 获取购物车价格信息
	getCartPriceInfo(state) {
		if (!state.order.originalTotalAmount) {
			return {
				originalTotalAmount: 0
			}
		}
	
		return {
			originalTotalAmount: state.order.originalTotalAmount
		}
	},

}

const mutations = {
	// 获取确认订单
	getConfirmOrderMutation(state, payload) {
		state.order = payload
	}
}

const actions = {
	// 获取确认订单
	async getConfirmOrderAction({
		commit,
		dispatch
	}) {
		let result = await this._vm.$u.api.getConfirmOrder()
		commit('getConfirmOrderMutation', result)
		// 利用root属性将派发pickUpLocation模块中的action动作
		dispatch('pickUpLocationModule/changeUserAddressVoAction', result.userAddressVo, {
			root: true
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
