// 封装购物车模块
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useUserStore } from "./userStore"
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart"



export const useCartStore = defineStore('cart', () => {
    const cartList = ref([])
    const userStore = useUserStore()
    const isLogin = computed(() => userStore.userInfo.token)

    // 计算属性
    // 1. 总的数量  所有项的count的总和
    const totalCount = computed(() => {
        return cartList.value.reduce((pre, cur) => pre + cur.count, 0)
    })
    // 2. 总价  所有项的price*count的总和
    const totalPrice = computed(() => {
        return cartList.value.reduce((pre, cur) => pre + cur.price * cur.count, 0)
    })
    // 3. 已选中商品的数量
    const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((pre, cur) => pre + cur.count, 0))
    // 4. 已选中商品的总价
    const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((pre, cur) => pre + cur.price * cur.count, 0))

    // 是否全选
    const isAll = computed(() => cartList.value.every((item) => item.selected))


    // 获取最新购物车列表action
    const updateNewList = async () => {
        const res = await findNewCartListAPI()
        cartList.value = res.result
    }

    // 添加购物车操作
    const addCart = async (goods) => {
        const { skuId, count } = goods
        if(isLogin.value) {
            // 登录状态
            await insertCartAPI({ skuId, count })
            await updateNewList()
        }else {
            // 非登录状态
            // 已添加过 count+1
            // 未添加过 直接添加
            // 如何判断是否添加: 通化匹配传递过来的商品对象中的skuId能不能在cartList中找到, 找到了就是添加过
            const item = cartList.value.find((item) => goods.skuId === item.skuId)
            if (item) {
                item.count += goods.count
            } else {
                cartList.value.push(goods)
            }   
        }
    }

    // 删除购物车操作
    const delCart = async (skuId) => {

        if(isLogin.value) {
            // 登录状态
            await delCartAPI([skuId])
            await updateNewList()
        }else {
            // 非登录状态
            const idx = cartList.value.findIndex((item) => item.skuId === skuId)
            cartList.value.splice(idx, 1)
        }
        
    }

    // 清除购物车
    const clearCart = () => {
        cartList.value = []
    }

    // 单选功能
    const singleCheck = (skuId,selected) => {
        // 通过skuId找到要修改的那一项,然后把它的selected修改为传过来的selected
        const item = cartList.value.find((item) => item.skuId === skuId)
        item.selected = selected
    }

    // 全选功能
    const allCheck = (selected) => {
        cartList.value.forEach(item => item.selected = selected)
    }


    return {
        cartList,
        totalCount,
        totalPrice,
        selectedCount,
        selectedPrice,
        isAll,
        updateNewList,
        addCart,
        delCart,
        clearCart,
        singleCheck,
        allCheck
    }
}, {
    persist: true,
}
)
