
const get_home_index = 'home/index' // 获取首页数据
const post_save_address = 'home/addAddress' // 保存收货地址
const get_categories = '/home/category' // 获取分类
const get_search_sku = '/search/sku' // 搜索商品
const get_home_item = '/home/item' // 商品详情
const get_add_to_cart = '/cart/addToCart' // 加入购物车
const get_check_cart = '/cart/checkCart' // 切换购物车商品的选中状态
const delete_cart = '/cart/deleteCart' // 删除购物车
const get_cart_pages_info = '/cart/getCartPagesInfo' // 购物车列表
const get_check_all_cart = '/cart/checkAllCart' // 对所有购物车商品进行全选/反选
const get_confirm_order = '/order/auth/confirmOrder' // 确认订单
const post_submit_order = '/order/auth/submitOrder' // 生成订单
const get_order_info = '/order/auth/getOrderInfoById' // 订单详情
const get_wx_login = '/user/weixin/wxLogin' // 微信用户登陆
const post_update_user = '/user/weixin/auth/updateUser' // 更新用户信息
const get_weixin_payment = '/payment/weixin/createJsapi/' // 获取微信支付信息
const get_find_user_order = '/order/auth/findUserOrderPage' // 获取用户订单信息
const get_order_status = '/payment/weixin/queryPayStatus' // 获取订单状态

const install = (Vue, vm) => {
	const limit = 10;
	const page = 1

	// 获取首页数据
	const getHomeIndex = () => vm.$u.get(get_home_index);
	/*---------------------------------------------------------
		收货地址模块
	---------------------------------------------------------*/
	// 保存收货地址信息
	const postSaveAddress = (o) => vm.$u.post(post_save_address, o);
	/*---------------------------------------------------------
		商品模块
	---------------------------------------------------------*/
	// 获取分类
	const getCategories = () => vm.$u.get(get_categories, {
		showLoading: false
	});
	// 搜索商品
	const getSearchSku = (o) => vm.$u.get(get_search_sku +
		`/${o.page || page}/${o.limit || limit}`, {
			...o,
			limit: o.limit || limit
		});
	// 商品详情
	const getHomeItem = (o) => vm.$u.get(get_home_item + `/${o.skuId}`);
	/*---------------------------------------------------------
		购物车模块
	---------------------------------------------------------*/
	// 加入购物车
	const getAddToCart = (o) => vm.$u.get(get_add_to_cart + `/${o.skuId}/${o.skuNum}`, {
		showLoading: false
	});
	// 切换购物车商品的选中状态
	const getCheckCart = (o) => vm.$u.get(get_check_cart + `/${o.skuId}/${o.isChecked}`, {
		showLoading: false
	});
	// 删除购物车
	const deleteCart = (skuId) => vm.$u.delete(delete_cart + `/${skuId}`, {
		showLoading: false
	});
	// 获取购物车页面列表
	const getCartPagesInfo = (o) => vm.$u.get(get_cart_pages_info, {
		showLoading: o.showLoading ? o.showLoading : false
	});
	// 对所有购物车商品进行全选/反选
	const getCheckAllCart = (o) => vm.$u.get(get_check_all_cart + `/${o.isChecked}`, {
		showLoading: o.showLoading ? o.showLoading : false
	});
	// 对指定的多个商品进行选择/反选
	const postBatchCheckCart = (o) => vm.$u.post(post_batch_check_cart + `/${o.isChecked}`, o.skuIdList);
	// 确认订单
	const getConfirmOrder = () => vm.$u.get(get_confirm_order)
	// 生成订单
	const postSubmitOrder = (o) => vm.$u.post(post_submit_order, o)
	// 订单详情
	const getOrderInfo = (o) => vm.$u.get(get_order_info + `/${o.orderId}`)
	// 获取微信支付信息
	const getWxPayment = (o) => vm.$u.get(get_weixin_payment + `/${o.orderNo}`)
	
	// 获取订单状态信息
	const getOrderStatus = (o) => vm.$u.get(get_order_status + `/${o.orderNo}`)
	
	/*---------------------------------------------------------
		用户登陆
	---------------------------------------------------------*/
	// 微信用户登陆
	const getWxLogin = (o) => vm.$u.get(get_wx_login + `/${o.code}`, {
		showLoading: false
	})
	// 更新用户信息
	const postUpdateUser = (o) => vm.$u.post(post_update_user, {
		...o,
		showLoading: false
	})
	// 获取用户订单信息
	const getFindUserOrder = (o) => vm.$u.get(get_find_user_order + `/${o.page}/${o.limit}`, {
		...o
	})

	vm.$u.api = {
		getHomeIndex,
		getCategories,
		getSearchSku,
		getHomeItem,
		getAddToCart,
		getCheckCart,
		deleteCart,
		getCartPagesInfo,
		getCheckAllCart,
		getConfirmOrder,
		postSubmitOrder,
		getOrderInfo,
		getWxPayment,
		getWxLogin,
		postUpdateUser,
		getFindUserOrder,
		getOrderStatus,
		postSaveAddress
	};
}

export default {
	install
}