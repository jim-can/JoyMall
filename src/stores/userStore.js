// 管理用户数据相关
import { loginAPI } from "@/apis/user"
import { mergeCartAPI } from "@/apis/cart"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useCartStore } from "./cartStore"

export const useUserStore = defineStore('user', () => {
    const cartStore = useCartStore()
    const userInfo = ref({})
    const getUserInfo = async ({account, password}) => {
        const res = await loginAPI({account, password})
        userInfo.value = res.result
        // 合并本地购物车数据到服务器购物车
        await mergeCartAPI(cartStore.cartList.map(item => { 
            return { 
                skuId: item.skuId,
                selected: item.selected,
                count: item.count,
        }}))
        
        // 刷新购物车列表
        await cartStore.updateNewList()
    }

    // 退出时清空用户信息
    const clearUserInfo = () => {
        userInfo.value = {}
        // 执行清除购物车的action
        cartStore.clearCart()
    }
    
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: true
})
