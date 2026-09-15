// 封装分类数据业务相关代码
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryAPI } from '@/apis/category'

export function useCategory() {
    const route = useRoute()

    const categoryData = ref({})
    const getCategory = async () => {
        const res = await getCategoryAPI(route.params.id)
        categoryData.value = res.result
    }
    onMounted(() => getCategory())

    return { categoryData }
}