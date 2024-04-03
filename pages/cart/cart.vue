<template>
	<view class="gg">
		<u-navbar :is-back="false" :border-bottom="false">
			<view class="u-flex u-m-l-20 u-m-r-20" >
				<view class="u-font-xl u-m-r-20">购物车</view>
				<view class="u-font-xs u-light-color u-p-t-10" v-if="getCartInfoList">共{{ getSelectedCount }}件商品</view>
			</view>
		</u-navbar>

		<view class="gg-content">
			<scroll-view scroll-y="true" class="gg-cart-sv-container" v-if="getCartInfoList">
				<u-checkbox-group>
					<view>
						<u-card :padding="10" :border="false" >
							<view slot="body">
								<view v-for="(cartInfoItem, idx) in getCartInfoList" :key="idx">
									<!-- 动态class绑定是为了确保最后一条底部线条不显示 -->
									<view class="u-body-item u-flex u-col-between u-p-10">
										<u-checkbox
											v-model="cartInfoItem.isChecked"
											shape="circle"
											active-color="red"
											:name="cartInfoItem.skuId"
											@change="changeChecked"
										></u-checkbox>
										<ListImgItem
											:lazyLoad="false"
											:src="cartInfoItem.imgUrl"
											width="200rpx"
											height="200rpx"
											:showBottom="cartInfoItem.isNewPerson === 1"
										></ListImgItem>
										<view class="u-p-b-20 u-m-l-20" style="flex:1">
											<view class="u-font-lg">{{ cartInfoItem.skuName }}</view>
											<view class="u-flex u-row-between">
												<view class="u-type-error">
													<text>￥</text>
													<text>{{ cartInfoItem.cartPrice }}</text>
												</view>
												<AddToCart :shopDetail="cartInfoItem" :skuId="cartInfoItem.skuId"></AddToCart>
											</view>
										</view>
									</view>
								</view>
							</view>
						</u-card>
					</view>
				</u-checkbox-group>
			</scroll-view>

			<u-empty mode="car" v-else :margin-top="300"><u-button slot="bottom" type="error" @click="gotoCategory">点击购买商品</u-button></u-empty>

			<view class="gg-navigation" v-if="getCartInfoList">
				<view class="navigation" v-if="getCartInfoList">
					<view class="left">
						<view class="item u-m-t-20"><u-checkbox :value="isAllSelected" shape="circle" active-color="red" @change="changeAllSelected"></u-checkbox></view>
						<view class="item">
							<view class="u-font-sm u-line-1">
								<view class="u-type-error">总价:￥{{ getCartPriceInfo.originalTotalAmount }}</view>
							</view>
						</view>
					</view>
					<view class="right"><view class="buy btn u-line-1" @click="gotoConfirmOrder">立即购买</view></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
	data() {
		return {
		};
	},
	computed: {
		...mapGetters('cartModule', [
			'getCartInfoList',
			'isAllSelected',
			'isAllSelected',
			'getCartPriceInfo',
			'getSelectedCount',
		]),
		...mapGetters('pickUpLocationModule', ['userAddressVo']),
			
	},
	methods: {
		...mapActions('cartModule', ['getCartPagesInfoAction', 'changeCheckCartAction', 'changeAllCheckCartAction']),
		// 到分类页购买商品
		gotoCategory() {
			uni.switchTab({
				url: '/pages/categories/categories'
			});
		},
		// 修改单个商品选中状态
		changeChecked(detail) {
			let isChecked = 1;
			const { name: skuId, value } = detail;
			if (!value) isChecked = 0;
			this.changeCheckCartAction({ skuId, isChecked });
		},
		// 全部选中/返选
		changeAllSelected(detail) {
			this.changeAllCheckCartAction({ isChecked: detail.value === true ? 1 : 0 });
		},
		// 跳转至确认订单
		gotoConfirmOrder(){
			// 获取当前用户是否已经有收货地址
			if(this.userAddressVo == null || this.userAddressVo == undefined || this.userAddressVo == {}){
				uni.redirectTo({
				 				url: '/pagesLocation/myPickUpLocation/myPickUpLocation'
						});
						uni.showToast({
							title: "请先填写收获地址",
							icon: 'none'
						})
				return;
			}
			
			this.$u.route('/pagesOrder/confirmOrder/confirmOrder')
		}
	},
	// 思考：为什么需要将请求放置于onShow钩子函数中，
	// 主要考虑tabs切换后需要进行实时数据的获取
	onShow() {
		this.getCartPagesInfoAction({ showLoading: true });
	},

};
</script>

<style lang="scss">
.gg {
	height: 100%;
	background-color: $u-bg-color;

	// scrollView的固定高度设置
	// 底部导航与顶部自定义导航高度需要减去
	&-cart-sv-container {
		height: calc(100vh - 90rpx - 136rpx);
	}

	// 底部导航
	&-navigation {
		width: 100%;
		height: 90rpx;
		position: fixed;
		bottom: 0;
		.navigation {
			height: 100%;
			display: flex;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 12rpx 0;
			.left {
				display: flex;
				flex: 1;
				font-size: 20rpx;
				.item {
					margin: 0 10rpx;
					&.car {
						text-align: center;
						position: relative;
					}
				}
			}
			.right {
				display: flex;
				font-size: 28rpx;
				align-items: center;
				.btn {
					line-height: 66rpx;
					padding: 0 30rpx;
					border-radius: 36rpx;
					color: #ffffff;
				}
				.buy {
					background-color: #ff7900;
					margin: 0 30rpx;
				}
			}
		}
	}
}
</style>
