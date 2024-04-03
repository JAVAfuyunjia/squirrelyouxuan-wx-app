const state = {
	home: {}
};
const getters = {
	// 商品分类
	categoryList(state) {
		return state.home.categoryList || [];
	},
	// 热销商品
	hotSkuList(state) {
		return state.home.hotSkuList || [];
	},
	// 新人专享
	newPersonSkuInfoList(state) {
		return state.home.newPersonSkuInfoList || [];
	},
	// 地址信息
	userAddressVo(state) {
		return state.home.userAddressVo || {}
	},
};
const mutations = {
	// 获取首页数据
	getHomeIndexMutation(state, payload) {
		state.home = payload
	}
};
const actions = {
	async getHomeIndexAction({
		commit,
		dispatch
	}) {
		// 直接用this.$u.api在仓库中是无法调用到对应的接口的，因为this对象指向不同
		// 仓库中的this指向的是Store，所以需要通过this._vm来找到对应的Vue实例
		let result = await this._vm.$u.api.getHomeIndex()
		await commit('getHomeIndexMutation', result)
		// 利用root属性将派发pickUpLocation模块中的action动作
		dispatch('pickUpLocationModule/changeUserAddressVoAction', result.userAddressVo, {
			root: true
		})
		
	}
};
export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
