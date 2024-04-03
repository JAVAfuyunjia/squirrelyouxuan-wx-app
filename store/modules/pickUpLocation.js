const state = {
	userAddressVo: {}, // 当前提货点
};
const getters = {
	userAddressVo(state) {
		return state.userAddressVo;
	},	
	
};
const mutations = {
	changeUserAddressVoMutation(state, payload) {
		state.userAddressVo = payload;
	}
};
const actions = {

	changeUserAddressVoAction({
		commit,
		dispatch
	}, payload) {
		commit('changeUserAddressVoMutation', payload)
	},
	// 保存用户地址
	saveUserAddressVoAction({
		commit,
		dispatch	
},payload){
	this._vm.$u.api.postSaveAddress(payload);
	// 更新地址
	commit('changeUserAddressVoMutation', payload)
}
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
 