<template>
	<view class="gg" v-if="!detail.skuInfoVo">
		<u-empty mode="data"></u-empty>
	</view>
	<view class="gg" v-else>
		<u-navbar :is-back="true" :border-bottom="false" class="navbar"></u-navbar>

		<scroll-view scroll-y class="gg-sv">
			<view class="gg-content">
				<!-- 商品轮播图 -->
				<block v-if="swiperList.length > 0"><u-swiper :list="swiperList" :height="500" mode="number" indicator-pos="bottomRight"></u-swiper></block>

				<!-- 商品缩略图及属性还有价格购买数量的显示 -->
				<view class="u-flex u-type-info-light u-p-20 gg-content-price">
					<view class="u-p-r-20">
						<ListImgItem
							:src="detail.skuInfoVo.imgUrl"
							width="120rpx"
							height="120rpx"
							:showLeft="detail.skuInfoVo.skuType === 1"
							:showRight="false"
							:showBottom="detail.skuInfoVo.skuType === 0 && detail.skuInfoVo.isNewPerson === 1"
						></ListImgItem>
					</view>
					
					<!-- 普通商品显示 -->
					<block>
						<view>
							<view class="gg-content-price-current u-flex">
								<view>当前价格：￥{{ detail.skuInfoVo.price }}</view>
								<view class="u-p-l-20">市场价格：￥{{ detail.skuInfoVo.marketPrice }}</view>
							</view>
							<view class="gg-content-price-limit">
								<view>限购数量：{{ detail.skuInfoVo.perLimit }}件</view>
							</view>
						</view>
					</block>
				</view>

				<!-- 商品名称 -->
				<view class="u-m-20 u-p-20 gg-content-container">
					<view class="u-flex">{{ detail.skuInfoVo.skuName }}</view>
				</view>

				<!-- 属性列表 -->
				<view class="u-m-20 u-p-20 gg-content-container" v-if="detail.skuInfoVo.skuAttrValueList.length > 0">
					<view class="u-p-t-5" v-for="skuAttrValueItem in detail.skuInfoVo.skuAttrValueList" :key="skuAttrValueItem.id">
						{{ skuAttrValueItem.attrName }}：{{ skuAttrValueItem.attrValue }}
					</view>
				</view>

	

				<!-- 售后与提货地址 -->
				<view class="u-m-20 u-p-20 gg-content-container">
					<view class="u-flex">
						<view class="u-font-sm u-m-r-20 u-type-info">售后无忧</view>
						<view class="u-font-sm u-m-r-20 u-flex-1">
							支持保价
							<text class="u-type-error">・</text>
							极速退款
							<text class="u-type-error">・</text>
							7天无理由退货
						</view>
						<u-icon name="arrow-right" size="24" class="u-m-r-20 u-type-info"></u-icon>
					</view>

		
				</view>

				<!-- 商品详情图片清单 -->
				<view class="u-m-20 u-p-20 gg-content-container" v-if="skuPosterList.length > 0">
					<image v-for="skuPoster in skuPosterList" :key="skuPoster.id" :src="skuPoster.image"></image>
				</view>
				<u-gap height="30"></u-gap>
			</view>
		</scroll-view>

		<view class="gg-navigation">
			<view class="navigation">
				<view class="left">
					<view class="item" @click="gotoHome">
						<u-icon name="home-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
						<view class="text u-line-1">首页</view>
					</view>
					<view class="item car" @click="gotoCart">
						<u-badge class="car-num" :count="getProductSkuNum(skuId)" v-if="skuId !== 0" type="error" :offset="[-3, -6]"></u-badge>
						<u-icon name="shopping-cart-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
						<view class="text u-line-1">购物车</view>
					</view>

				</view>
				<view class="right u-p-r-10 u-flex">
					<!-- 加入购物车 -->
					<block>
						<view class="u-m-r-20 u-line-1  u-flex-1"><AddToCart :shopDetail="getDetail" :skuId="detail.skuInfoVo.id" v-if="detail.skuInfoVo.id"></AddToCart></view>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			detail: {},
			skuId: 0,
		};
	},
	computed: {
		...mapGetters('cartModule', ['getProductSkuNum']),
		// 轮播图的获取
		swiperList() {
			let lst = [];
			this.detail &&
				this.detail.skuInfoVo &&
				this.detail.skuInfoVo.skuImagesList.length > 0 &&
				this.detail.skuInfoVo.skuImagesList.forEach(item => {
					lst.push({
						image: item.imgUrl,
						title: item.imgName
					});
				});
			return lst;
		},
		// 商品详情海报图片列表
		skuPosterList() {
			let lst = [];
			this.detail &&
				this.detail.skuInfoVo &&
				this.detail.skuInfoVo.skuPosterList.length > 0 &&
				this.detail.skuInfoVo.skuPosterList.forEach(item => {
					lst.push({
						image: item.imgUrl,
						title: item.imgName
					});
				});
			return lst;
		},
		getDetail() {
			return { ...this.detail.skuInfoVo };
		}
	},
	methods: {
		async getHomeItemData(skuId) {
			let result = await this.$u.api.getHomeItem({ skuId });
			this.detail = result;
			// skuInfoVo 商品信息
		
		},
		// 切换首页
		gotoHome() {
			uni.switchTab({
				url: '/pages/index/index'
			});
			return false;
		},
		// 切换购物车
		gotoCart() {
			uni.switchTab({
				url: '/pages/cart/cart'
			});
			return false;
		},
	},
	onLoad(options) {
		let skuId = +options.skuId;
		this.skuId = skuId;
		this.getHomeItemData(skuId);
	}
};
</script>

<style lang="scss">
.gg {
	height: 100%;

	&-sv {
		height: calc(100vh - 116rpx - 102rpx);
	}

	&-content {
		background-color: $u-bg-color;

		&-price {
			background: linear-gradient(to right, rgb(255, 180, 61), rgb(255, 101, 0));
		}

		&-container {
			z-index: 9999;
			background-color: #fff;
			border-radius: 25rpx;
		}
	}

	&-navigation {
		position: fixed;
		bottom: 0;
		width: 100%;
		.navigation {
			display: flex;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 16rpx 0;
			justify-content: space-around;
			.left {
				display: flex;
				font-size: 20rpx;
				.item {
					margin: 0 30rpx;
					&.car {
						text-align: center;
						position: relative;
						.car-num {
							position: absolute;
							top: -10rpx;
							right: -10rpx;
						}
					}
				}
			}
			.right {
				width: 375rpx;
				display: flex;
				font-size: 28rpx;
				align-items: center;
				.btn {
					line-height: 50rpx;
					padding: 0 30rpx;
					border-radius: 36rpx;
					color: #ffffff;
				}
				.buy {
					background-color: #ff7900;
				}
				.buy-disabled {
					background-color: $u-type-info;
				}
			}
		}
	}
}
</style>
