<template>
	<view class="gg" v-if="token">
		<!-- 利用background-image设置导航的线形渐变色彩 -->
		<u-navbar :is-back="false" :border-bottom="false"
			:background="{ 'background-image': 'linear-gradient(to right, rgb(255,180,61), rgb(255, 101, 0))' }">
			<view class="gg-map-slot-wrap u-font-xs u-m-l-20 u-p-l-10 u-p-r-10 u-p-t-5 u-p-b-5" @click="pickUpLocation">
				<u-icon name="map" size="24"></u-icon>
				<text
					class="u-p-l-10 u-p-r-10">{{ userAddressVo.addressDetail ? userAddressVo.addressDetail : '请设置收货地点' }}</text>
				<u-icon name="arrow-right" size="20"></u-icon>
			</view>
		</u-navbar>

		<!-- 主内容区域-Begin -->
		<view class="gg-content">
			<!-- 头部区域 -->
			<view class="gg-header u-p-l-20 u-p-r-20">
				<!--
				头部滚动提示搜索区
				1.搜索图标
				2.滚动提示条
				3.搜索按钮（自定义样式）
				-->
			<!-- 	<view class="gg-notice-search-bar">
					<u-icon name="search" class="gg-notice-search-bar-left-icon"></u-icon>
					<u-notice-bar class="gg-notice-search-bar-u-notice-bar" type="none" mode="vertical"
						:is-circular="false" :list="list" :border-radius="30" :volume-icon="false"
						:more-icon="false"></u-notice-bar>
					<u-button class="u-m-r-20" type="error" size="mini" shape="square"
						:custom-style="ggNoticeSearchBarRightBtnCustomStyle">搜索</u-button>
				</view> -->

				<!-- 新人专享低价好物sv滚动区 -->
				<view class="gg-new-vip u-p-20 u-m-t-20">
					<view class="u-font-lg u-content-color">新上架低价好物</view>
					<scroll-view scroll-x enable-flex class="gg-new-vip-sv">
						<view class="u-flex u-m-t-10">
							<view class="gg-new-vip-sv-item u-p-r-20" v-for="(item, index) in newPersonSkuInfoList"
								:key="item.id" @click="gotoProductItem(item.id)">
								<ListImgItem :src="item.imgUrl" width="200rpx" height="200rpx"></ListImgItem>
								<text class="u-type-error">￥ {{ item.price }}</text>
								<AddToCart :shopDetail="item" :skuId="item.id"></AddToCart>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 头部区域底部左右圆角区 -->
			<view class="gg-header-bottom"></view>

			<!-- 优选规则 -->
			<view class="u-flex u-row-between u-p-20 u-m-20 gg-border" @click="showRulePopup = true">
				<u-image src="/static/logo.png" width="30rpx" height="30rpx"></u-image>
				<view>平台资质、法律条款、规则及投诉入口</view>
			</view>



			<!-- 如何购买商品 -->
			<view class="u-p-20 u-m-20 gg-border u-font-xs">
				<view class="u-m-b-20">如何在[松鼠优选]购买商品</view>
				<view class="u-flex">
					<view class="gg-number u-m-r-10">1</view>
					挑商品
					<u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
					<u-icon class="u-content-color" name="arrow-right-double"></u-icon>
					<view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">2</view>
					设置收货地址
					<u-icon name="arrow-right-double u-m-l-10 u-tips-color"></u-icon>
					<u-icon class="u-content-color" name="arrow-right-double"></u-icon>
					<view class="gg-number gg-number-gray u-m-r-10 u-m-l-10">3</view>
					付款收货
				</view>
			</view>

			<!-- 热销好货 -->
			<view class="u-font-xl u-type-error u-m-20">热销好货</view>
			<view class="u-p-20 u-m-20 gg-border" v-for="(item, index) in hotSkuList" :key="item.id"
				@click="gotoProductItem(item.id)">
				<view class="u-m-b-10 u-m-l-20 u-m-r-20 u-flex gg-product-item">
					<ListImgItem :src="item.imgUrl" width="250rpx" height="250rpx"
						:showBottom="item.skuType === 0 && item.isNewPerson === 1"></ListImgItem>

					<view class="gg-product-item-msg u-border-bottom u-p-b-20 u-m-l-20">
						<view class="gg-product-item-msg-title">
							<view class="u-font-lg">{{ item.title }}</view>
							<view class="u-type-info u-font-sm">已售{{ item.sale }}/剩余{{ item.stock }}</view>
							<block v-if="item.ruleList">
								<view class="u-font-xs u-type-error-dark" v-for="(rule, ruleIndex) in item.ruleList"
									:key="ruleIndex">{{ rule }}</view>
							</block>
						</view>
						<view class="u-flex u-row-between">
							<view class="u-type-error gg-product-item-msg-price">
								<text>￥</text>
								<text class="gg-product-item-msg-price-value">{{ item.price }}</text>
							</view>
							<AddToCart :shopDetail="item"></AddToCart>
						</view>
					</view>
				</view>
			</view>

			<u-gap height="20"></u-gap>
		</view>
		<!-- 主内容区域-End -->

		<!-- 平台资质、法律条款、规则及投诉入口弹出框 -->
		<u-popup v-model="showRulePopup" mode="bottom" border-radius="20" :closeable="true">
			<view class="u-p-t-20 u-p-b-20">
				<view class="u-m-20">
					<view class="u-font-xl u-m-b-10">
						<u-icon name="checkmark-circle" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
						品质保障
					</view>
					<view class="u-light-color u-font-xs">全场商品均经过品质检验，若收货时发现商品有变质、腐烂、损坏等情况，可申请退款</view>
				</view>

				<view class="u-m-20">
					<view class="u-font-xl u-m-b-10">
						<u-icon name="kefu-ermai" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
						极速退款
					</view>
					<view class="u-light-color u-font-xs">根据平台的规则，在一定条件下，可享受极速退款到账服务</view>
				</view>

				<view class="u-m-20">
					<view class="u-font-xl u-m-b-10">
						<u-icon name="bag" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
						次日自提
					</view>
					<view class="u-light-color u-font-xs">每日23点前下单，次日16点可到下单门店自提</view>
				</view>

				<view class="u-m-20">
					<view class="u-font-xl u-m-b-10">
						<u-icon name="integral" color="#dd6161" size="28" class="u-m-r-10"></u-icon>
						资质规则
					</view>
					<view class="u-light-color u-font-xs">平台资质、法律条款、规则及投诉入口，点击查看详情</view>
				</view>
			</view>
		</u-popup>
	</view>

	<view v-else class="emptyPage"><u-empty mode="page"></u-empty></view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex';
	let watchTimes = 0;
	export default {
		data() {
			return {
				list: ['寒雨连江夜入吴', '平明送客楚山孤', '洛阳亲友如相问', '一片冰心在玉壶'],
				// 滚动提示搜索区右侧按钮自定义样式
				ggNoticeSearchBarRightBtnCustomStyle: {
					borderRadius: '30rpx'
				},
				showRulePopup: false,
				windowWidth: 0, // 设备宽度
				categorySVPercent: 0, // 精选进度百分比
				token: null
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					this.windowWidth = res.windowWidth;
				}
			});
		},
		computed: {
			...mapState('indexModule', ['home']),
			...mapGetters('indexModule', ['hotSkuList', 'newPersonSkuInfoList', 'userAddressVo'])
		},
		methods: {
			...mapActions('indexModule', ['getHomeIndexAction']),
			...mapActions('cartModule', ['getCartPagesInfoAction']),
			// 跳转至设置提货点
			pickUpLocation() {
				this.$u.route('/pagesLocation/myPickUpLocation/myPickUpLocation');
			},
			// 跳转至商品详情页
			gotoProductItem(skuId) {
				this.$u.route('/pages/homeItem/homeItem', {
					skuId
				});
			},

		},
		onShow() {
		this.getCartPagesInfoAction({ showLoading: true });
		this.getHomeIndexAction();
		},
		async mounted() {
			const token = await uni.getStorageSync('token');
			if (this.$u.test.isEmpty(token)) {
				uni.reLaunch({
					url: '/pages/login/login' 
				});
				return;
			}

			this.token = token;
			await this.getHomeIndexAction();
		}
	};
</script>

<style lang="scss" scoped>
	.gg {

		/* navbar 导航中进行地图位置的获取设置 */
		&-map-slot-wrap {
			display: flex;
			align-items: center;
			background-color: rgba(240, 240, 240, 0.35);
			color: #fff;
			border-radius: 100rpx;
		}

		/* 内容区域 */
		&-content {
			background-color: $u-bg-color;
		}

		/* 
		notice-bar头部滚动信息搜索区域
		利用background-image的linear-gradient保持与导航一致的线形渐变色彩 
	*/
		&-header {
			background-image: linear-gradient(to right, rgb(255, 198, 98), rgb(255, 140, 0));
			height: 500rpx;
		}

		/* 滚动信息搜索框 */
		&-notice-search-bar {
			display: flex;
			align-items: center;
			background-color: white;
			border-radius: 30rpx;

			/* 滚动信息搜索框左侧图标 */
			&-left-icon {
				position: relative;
				left: 20rpx;
				color: $u-light-color;
			}

			/* 滚动信息搜索框中的字体设置 */
			&-u-notice-bar {
				flex: 1;

				/* 深层穿透修改子组件字体颜色样式 */
				::v-deep .u-news-item {
					color: $u-light-color !important;
				}
			}
		}

		/* 头部区域底部左右圆角区域 */
		&-header-bottom {
			background-image: linear-gradient(to right, rgb(255, 180, 61), rgb(255, 101, 0));
			height: 25rpx;
			border-bottom-left-radius: 25rpx;
			border-bottom-right-radius: 25rpx;
		}

		/* 新人专享 */
		&-new-vip {
			background-color: white;
			border-radius: 20rpx;

			&-sv {
				height: 320rpx;

				&-item {
					display: flex;
					flex-direction: column;
				}
			}
		}

		/* 规则 */
		&-border {
			border-radius: 20rpx;
			border-bottom: 1rpx solid #f5f5f5;
			box-shadow: 0px 1px 20px 0px rgba(0, 0, 0, 0.1);
			/*下边阴影 */
		}

		/* 商品分类 */
		&-category {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 5rpx;

			&-progress {
				width: 10vw;
			}
		}

		/* 如何购买商品 */
		&-number {
			border-radius: 50%;
			background-color: $u-type-warning;
			width: 30rpx;
			height: 30rpx;
			text-align: center;
			font-size: 20rpx;
			color: white;

			&-gray {
				background-color: gray;
			}
		}

		/* 热销好货 */
		&-product-item {
			height: 250rpx;

			&-msg {
				height: 100%;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				&-price {
					&-value {
						font-size: 50rpx;
					}
				}
			}
		}
	}

	.emptyPage {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>