<template>
	<view class="container">
		<!-- <u-avatar size="140" src="/static/user.jpg" mode="circle"></u-avatar> -->
		<u-form :model="locationInfo" ref="form" class="forms">
			<u-form-item prop="name" left-icon-style="font-size: 24px;color: #ffab19;" label-width="auto"
				left-icon="account-fill">
				<u-input placeholder="姓名" v-model="locationInfo.name" />
			</u-form-item>
			<u-form-item prop="mobile" left-icon-style="font-size: 24px;color: #ffab19;" label-width="auto"
				left-icon="phone">
				<u-input placeholder="手机号码" v-model="locationInfo.mobile" />
			</u-form-item>
			<u-form-item prop="location" left-icon-style="font-size: 24px;color: #ffab19;" label-width="auto"
				left-icon="home-fill">
				<picker mode="region" :value="locationInfo.address" @change="onRegionChange">
					<view class="picker" style="width: 100%;">
						<text>{{ locationInfo.address[0] }} {{ locationInfo.address[1] }} {{ locationInfo.address[2] }}</text>
					</view>
				</picker>
				<uni-icons icon="arrow-right" size="24"></uni-icons>
			</u-form-item>
			<u-form-item prop="addressDetail" left-icon-style="font-size: 24px;color: #ffab19;" label-width="auto"
				left-icon="home">
				<u-input placeholder="详细地址" v-model="locationInfo.addressDetail" type="textarea" auto-height="true" />

			</u-form-item>
		</u-form>
		<view class="button-group">
			<button class="button" @click="saveAddress">保存</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {
				locationInfo: {
					name: '',
					mobile: '',
					address: ['请选择省份', '请选择城市', '请选择区县'], // 初始值为全部未选择
					addressDetail: '',
				},
				//表单验证规则
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: ['change']
					}],
					mobile: [{
							required: true,
							message: '请输入电话号码',
							trigger: ['change']
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					addressDetail: [{
						required: true,
						message: '请输入详细地址',
						trigger: ['change']
					}],

				}
			};
		},
		methods: {
			...mapActions('pickUpLocationModule', ['saveUserAddressVoAction']),
			onRegionChange(e) {
				this.locationInfo.address = e.detail.value;
			},
			saveAddress() {

				this.$refs.form.validate(async valid => {
					if (valid) {
						// 封装信息
						const addressFormData = {
							name: this.locationInfo.name,
							phone: this.locationInfo.mobile,
							// 数组转为字符串
							address: this.locationInfo.address.join(','),
							addressDetail: this.locationInfo.addressDetail,
						};

						// 保存数据
						let res = await this.saveUserAddressVoAction(addressFormData);
						// 这里获取结果仅仅是为了等待服务器处理完本次请求而已。
						// 跳转到首页 
						uni.reLaunch({
							url: '/pages/index/index'
						});

					}
				});
			},
		},
		computed: {
			...mapGetters('pickUpLocationModule', ['userAddressVo']),
		},
		mounted() {
			// 初始化数据
			let correntUserAddressVo = this.userAddressVo
			if (correntUserAddressVo) {
				this.locationInfo.name = this.userAddressVo.name;
				this.locationInfo.mobile = this.userAddressVo.phone
				this.locationInfo.addressDetail = this.userAddressVo.addressDetail
				this.locationInfo.address = this.userAddressVo.address.split(',');
			}

		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.form.setRules(this.rules);
		}
	}
</script>

<style lang="scss" scoped>
	input {
		height: 80rpx;
		line-height: 80rpx;
		width: 75%;

	}


	.container {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 90%;
		margin: auto;

		.forms {
			width: 100%;
			padding: 25px 20px;
		}
	}

	.form-group {
		display: flex;
		align-items: center;
		height: 100rpx;
		width: 100%;
		color: gray;
		/* 设置颜色为灰色 */
		font-size: 33rpx;
		/* 设置字体大小 */
	}

	.form-label {
		width: 150rpx;
		text-align: right;
		padding-right: 20rpx;
		/* 添加内边距 */
	}

	.picker {
		width: 70%;
	}

	.button-group {
		display: flex;
		justify-content: space-around;
		margin-top: 50rpx;
		width: 100%;
		/* 设置宽度为100% */
	}

	.button {
		width: 70%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		color: #fff;
	}

	.button:nth-child(1) {
		background-color: #f56c00;
	}

	.line {
		width: 100%;
		height: 1rpx;
		background-color: #ccc;
		margin-top: 20rpx;
	}
</style>