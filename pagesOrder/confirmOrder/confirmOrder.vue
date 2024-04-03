<template>
	<view class="gg">
		<u-navbar :is-back="true" :border-bottom="false">
			<view class="u-flex u-m-l-20 u-m-r-20">
				<view class="u-font-xl u-m-r-20">生成订单</view>
				<view class="u-font-xs u-light-color u-p-t-10">共{{ getSelectedCount }}件商品</view>
			</view>
		</u-navbar>
		<view class="gg-content">
			<scroll-view scroll-y="true" class="gg-cart-sv-container">
				<!-- 提货点 -->
				<u-card :padding="10" :show-head="false">
					<view slot="body" class="u-m-10">收货地址：{{ getUserAddressVo.addressDetail }}</view>
				</u-card>

				<u-card :padding="10" :show-head="true">
					<view slot="head" class="u-m-10">提货人联系方式</view>
					<view slot="body" class="u-m-10">
						<u-input v-model="sumbitOrderForm.receiverName" placeholder="请输入提货人姓名" class="u-p-b-20" />
						<u-input v-model="sumbitOrderForm.receiverPhone" placeholder="请输入提货人电话"/>
					</view>
				</u-card>


				<!-- 商品 -->
				<view v-if="getCartInfoList">
					<u-card :padding="10" :border="false">

						<view slot="body">
							<view v-for="(cartInfoItem, idx) in getCartInfoList" :key="idx">
								<!-- 动态class绑定是为了确保最后一条底部线条不显示 -->
								<view class="u-body-item u-flex u-col-between u-p-10">
									<ListImgItem :lazyLoad="false" :src="cartInfoItem.imgUrl" width="200rpx"
										height="200rpx"
										:showBottom="cartInfoItem.skuType === 0 && cartInfoItem.isNewPerson === 1">
									</ListImgItem>
									<view class="u-p-b-20 u-m-l-20" style="flex:1">
										<view>{{ cartInfoItem.skuName }}</view>
										<view>购买数量：{{ cartInfoItem.skuNum }}</view>
										<view class="u-flex u-row-between">
											<view class="u-type-error">
												<text>￥</text>
												<text class="u-font-xl">{{ cartInfoItem.cartPrice }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</u-card>
				</view>
			</scroll-view>

			<view class="gg-navigation">
				<view class="navigation">
					<view class="left">
						<view class="item u-p-l-20">
							<view class="u-font-sm u-line-1">
								<view class="u-type-error">价格价:￥{{ getCartPriceInfo.originalTotalAmount }}</view>
							</view>
						</view>
					</view>
					<view class="right">
						<view class="buy btn u-line-1" @click="createSubmitOrder">生成订单</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex';
	import dayjs from 'dayjs';
	export default {
		data() {
			return {
				sumbitOrderForm: {
					orderNo: '',
					receiverName: '',
					receiverPhone: ''
				}
			};
		},
		computed: {
			...mapState('orderModule', ['order']),
			...mapGetters('orderModule', ['getCartInfoList', 'getSelectedCount', 'getCartPriceInfo',
				'getUserAddressVo'
			]),
		},
		
		mounted() {
			this.getConfirmOrderAction();
			this.getConfirmOrderInfo()
		
		},
	
		
		methods: {
			dayjs,
			...mapActions('orderModule', ['getConfirmOrderAction']),

			async createSubmitOrder() {
				this.sumbitOrderForm.orderNo = this.order.orderNo;

				if (this.$u.test.isEmpty(this.sumbitOrderForm.receiverName)) {
					uni.showToast({
						title: '请输入提货者姓名',
						icon: 'none'
					});
					this.sumbitOrderForm.receiverName = '';
					return;
				}

				if (!this.$u.test.mobile(this.sumbitOrderForm.receiverPhone)) {
					uni.showToast({
						title: '请输入提货者手机号码',
						icon: 'none'
					});
					this.sumbitOrderForm.receiverPhone = '';
					return;
				}

				const result = await this.$u.api.postSubmitOrder(this.sumbitOrderForm);
				this.$u.route(`/pagesOrder/getOrderInfo/getOrderInfo?orderId=${result}`);
			},
			async getConfirmOrderInfo(){
				let result = await this.$u.api.getConfirmOrder()
				this.sumbitOrderForm.receiverName = result.userAddressVo.name
				this.sumbitOrderForm.receiverPhone = result.userAddressVo.phone

				
			}
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

	.selected {
		background-color: $u-type-error !important;
	}
</style>