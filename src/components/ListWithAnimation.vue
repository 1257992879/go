<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref, watch} from "vue";

/**
 * 带有动画的列表
 * Version 1.0 beta 2
 */

const props = withDefaults(defineProps<{
    /** 内边距, css的padding将不起作用, 需要使用此属性来替代 */
    padding?: number,
    /** 子组件之间的垂直间距 (childrenGapVertical*2为行间距) */
    childrenGapVertical?: number,
    /** 子组件之间的水平间距 (子组件的左右间距) */
    childrenGapHorizontal?: number,
    /** 内容排布方式, center:各个元素聚集在中间, space-evenly:元素间有相同的空白空间, space-around:在各个元素的左右分别填充相同的空间 (当使用space-evenly或者space-around时需要确保传入的各个元素的宽度相同,否则会出现元素溢出的情况) */
    arrangementContent?: 'center' | 'space-evenly' | 'space-around',
    /** 子组件的水平对齐方式 */
    horizontalAlignment?: 'left' | 'center' | 'right',
    /** 子组件的垂直对齐方式 */
    verticalAlignment?: 'top' | 'center' | 'bottom',
}>(), {
    padding: 10,
    childrenGapVertical: 10,
    childrenGapHorizontal: 10,
    arrangementContent: 'center',
    horizontalAlignment: 'left',
    verticalAlignment: 'top',
})


const listDivEl = ref<HTMLDivElement>()

type ChildPosition = {
    offsetWidth: number,
    offsetHeight: number,
    top: number,
    left: number,
    position: {
        row: number,
        col: number
    }
}
const childrenPositionList = ref<ChildPosition[]>([])

const resizeObserver = new ResizeObserver(() => {
    // for (const entry of entries) {
    //     // const { width, height } = entry.contentRect;
    //     // console.log(`宽度: ${width}px, 高度: ${height}px`);
    // }

    // calculateChildPosition()
    callCalculateChildPosition()
})

const mutationObserver = new MutationObserver((mutations) => {
    // console.log(listDivEl.value?.children.length)
    // calculateChildPosition()
    callCalculateChildPosition()
})

function calculateChildPosition() {
    if (!listDivEl.value || listDivEl.value.children.length===0) return
    // console.log('calculateChildPosition')

    childrenPositionList.value = []
    // 存每一行高度的数组
    const lineHeightList: {row:number, height:number}[] = []

    // 父组件可显示内容区域的宽度 (不包括滚动条, 包括padding)
    const listClientWidth = listDivEl.value.clientWidth - (props.padding * 2)
    // 父组件的 offsetTop
    const listOffsetLeft = listDivEl.value.offsetLeft

    // 当前行的高度
    let currentRowHeight = 0

    // 当前行已用的宽度
    let currentRowUsedWidth = 0

    // 当前行元素个数
    let currentRowItemCount = 0

    // 当前行数
    let currentRowIndex = 0

    // 当前行的顶部位置
    let currentLineTop = props.padding + listDivEl.value.offsetTop

    // 给每一个子元素添加class、初步计算每个子元素的位置 (此时元素horizontalAlignment='center', verticalAlignment='top')
    for (const listItemEl of Array.from(listDivEl.value.children)) {
        listItemEl.classList.add('list-item-with-animation')

        // @ts-ignore
        const thisItemWidth: number = listItemEl.offsetWidth
        // @ts-ignore
        const thisItemHeight: number = listItemEl.offsetHeight

        const thisChildPosition: ChildPosition = {
            offsetWidth: thisItemWidth,
            offsetHeight: thisItemHeight,
            top: 0,
            left: listOffsetLeft,
            position: {
                row: 0,
                col: 0
            }
        }

        // 处理换行: 如果当前行已用宽度加上当前元素的宽度加上元素间距大于父组件的宽度, 并且当前行元素个数不为0 -> 换行
        if (currentRowUsedWidth + thisItemWidth + (props.childrenGapHorizontal*2) > listClientWidth
            &&
            currentRowItemCount !== 0
        ) {
            lineHeightList.push({
                row: currentRowIndex,
                height: currentRowHeight
            })
            currentRowIndex++
            currentLineTop += currentRowHeight
            currentRowHeight = 0
            currentRowItemCount = 0
            currentRowUsedWidth = 0
        }

        // 更新行高
        if (thisItemHeight + (props.childrenGapVertical*2) > currentRowHeight) {
            currentRowHeight = thisItemHeight + (props.childrenGapVertical*2)
        }
        // 如果是最后一个元素, 则将当前行高度加入lineHeightList
        if (listItemEl === listDivEl.value.children[listDivEl.value.children.length-1]) {
            lineHeightList.push({
                row: currentRowIndex,
                height: currentRowHeight
            })
        }

        // 更新当前行已用宽度
        currentRowUsedWidth += thisItemWidth + (props.childrenGapHorizontal*2)

        // 赋值当前行数和列数
        thisChildPosition.position.row = currentRowIndex
        thisChildPosition.position.col = currentRowItemCount

        // 更新当前行元素个数
        currentRowItemCount += 1

        // 更新当前元素的top位置
        thisChildPosition.top = currentLineTop + props.childrenGapVertical

        childrenPositionList.value.push(thisChildPosition)
    }

    // 判断每个元素的大小是否都相等
    let childrenSameSize = true
    for (const children of childrenPositionList.value) {
        if (children.offsetWidth !== childrenPositionList.value[0].offsetWidth
            ||
            children.offsetHeight !== childrenPositionList.value[0].offsetHeight
        ) {
            childrenSameSize = false
        }
    }

    // 做居中对齐处理
    if (props.arrangementContent === 'center') {
        for (let i = 0; i < childrenPositionList.value[childrenPositionList.value.length-1].position.row + 1; i++) {  //遍历每一行
            // 计算一行中所有元素加在一起的长度
            let usedWidth = 0
            for (let j = 0; j < childrenPositionList.value.length; j++) {
                if (childrenPositionList.value[j].position.row === i) {
                    usedWidth += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2)
                }
            }

            // 计算这一行元素的left值
            let left = props.padding + (listClientWidth/2) - (usedWidth/2)
            for (let j = 0; j < childrenPositionList.value.length; j++) {  //遍历一行中的每一个元素
                if (childrenPositionList.value[j].position.row === i) {
                    childrenPositionList.value[j].left += left + props.childrenGapHorizontal
                    left += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2)
                }
            }
        }
    } else if (props.arrangementContent === 'space-evenly') {
        let isFirstLine: boolean = true
        let gap = 0
        for (let i = 0; i < childrenPositionList.value[childrenPositionList.value.length-1].position.row + 1; i++) {  //遍历每一行
            // 计算一行中所有元素加在一起的长度
            let usedWidth = 0
            let lineItemCount = 0
            for (let j = 0; j < childrenPositionList.value.length; j++) {
                if (childrenPositionList.value[j].position.row === i) {
                    usedWidth += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2)
                    lineItemCount++
                }
            }

            if (isFirstLine) {
                gap = (listClientWidth - usedWidth) / (lineItemCount+1)
                isFirstLine = false
            }

            // 计算这一行元素的left值
            let left = props.padding + gap
            for (let j = 0; j < childrenPositionList.value.length; j++) {  //遍历一行中的每一个元素
                if (childrenPositionList.value[j].position.row === i) {
                    childrenPositionList.value[j].left += left + props.childrenGapHorizontal
                    left += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2) + gap
                }
            }
        }
    } else if (props.arrangementContent === 'space-around') {
        let isFirstLine: boolean = true
        let gap = 0
        for (let i = 0; i < childrenPositionList.value[childrenPositionList.value.length-1].position.row + 1; i++) {  //遍历每一行
            // 计算一行中所有元素加在一起的长度
            let usedWidth = 0
            let lineItemCount = 0
            for (let j = 0; j < childrenPositionList.value.length; j++) {
                if (childrenPositionList.value[j].position.row === i) {
                    usedWidth += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2)
                    lineItemCount++
                }
            }

            if (isFirstLine) {
                gap = (listClientWidth - usedWidth) / (lineItemCount * 2)
                isFirstLine = false
            }

            // 计算这一行元素的left值
            let left = props.padding + gap
            for (let j = 0; j < childrenPositionList.value.length; j++) {  //遍历一行中的每一个元素
                if (childrenPositionList.value[j].position.row === i) {
                    childrenPositionList.value[j].left += left + props.childrenGapHorizontal
                    left += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2) + (gap * 2)
                }
            }
        }
    }

    // 做左右对齐处理
    if (props.horizontalAlignment === 'left') {
        // 在整个文档中找出最左边的像素值
        let mostLeftPx
        if (childrenSameSize) {
            //计算如果一行被填满，最大可填充多宽
            // let usedWidth = 0
            // for (let j = 0; j < childrenPositionList.value.length; j++) {
            //     if (childrenPositionList.value[j].position.row === i) {
            //         usedWidth += childrenPositionList.value[j].offsetWidth + (props.childrenGapHorizontal*2)
            //     }
            // }
            // const maxLineWidth =
            // currentRowUsedWidth + thisItemWidth + (props.childrenGapHorizontal*2) >= listClientWidth
            mostLeftPx = childrenPositionList.value.reduce((prev, current) => {
                return prev.left < current.left ? prev : current
            }).left
        } else {
            mostLeftPx = childrenPositionList.value.reduce((prev, current) => {
                return prev.left < current.left ? prev : current
            }).left
        }

        // 左对齐: 如果有一行的第一个元素的left值不等于mostLeftPx, 则将那一行的每个元素的left值加上 (mostLeftPx - 第一个元素的left值)
        for (const el of childrenPositionList.value) {
            // 如果一行的第一个元素的left值不等于mostLeftPx就对这一行进行对齐处理
            if (el.position.col === 0 && el.left !== mostLeftPx) {
                const offset = mostLeftPx - el.left
                // console.log(`row: ${el.position.row}, offset=${offset}`)
                // console.log(listClientWidth)
                for (const el2 of childrenPositionList.value) {
                    if (el2.position.row === el.position.row) {
                        el2.left += offset
                    }
                }

            }
        }
    } else if (props.horizontalAlignment === 'right') {
        // 在整个文档中找出最右边的像素值
        const mostRightEl = childrenPositionList.value.reduce((prev, current) => {
            return (prev.left+prev.offsetWidth) > (current.left+current.offsetWidth) ? prev : current
        })
        const mostRightPx = mostRightEl.left + mostRightEl.offsetWidth

        // ===== 右对齐: 如果有一行的最后一个元素的 (left+offsetWidth) 不等于mostRightPx, 则将那一行的每个元素的left值加上 (mostLeftPx - (最后一个元素的left+offsetWidth))
        // 1.找出每一行最后一个元素的position
        const lastElPositionList: {row: number, lastCol: number}[] = []
        for (let i = 0; i < childrenPositionList.value.length; i++) {
            if (i === childrenPositionList.value.length-1
                ||
                childrenPositionList.value[i].position.row !== childrenPositionList.value[i+1].position.row
            ) {
                lastElPositionList.push({
                    row: childrenPositionList.value[i].position.row,
                    lastCol: childrenPositionList.value[i].position.col
                })
            }
        }
        // 2.做右对齐
        for (const el of lastElPositionList) {
            const lastEl = childrenPositionList.value.find((item) => item.position.row === el.row && item.position.col === el.lastCol)
            if (lastEl && lastEl.left + lastEl.offsetWidth !== mostRightPx) {
                const offset = mostRightPx - (lastEl.left + lastEl.offsetWidth)
                for (const el2 of childrenPositionList.value) {
                    if (el2.position.row === el.row) {
                        el2.left += offset
                    }
                }
            }
        }
    }

    // 做上下对齐处理
    if (props.verticalAlignment === 'center') {
        for (const itemEl of childrenPositionList.value) {
            itemEl.top += (lineHeightList[itemEl.position.row].height - (itemEl.offsetHeight+props.childrenGapVertical*2)) / 2
        }
    } else if (props.verticalAlignment === 'bottom') {
        for (const itemEl of childrenPositionList.value) {
            itemEl.top += (lineHeightList[itemEl.position.row].height - (itemEl.offsetHeight+props.childrenGapVertical*2))
        }
    }


    // console.log(lineHeightList)
    // console.log(childrenPositionList.value)
    // 对 DOM 进行操作
    listDivEl.value.style.height = lineHeightList.reduce((prev, current) => {
        return prev + current.height
    }, 0) + (props.padding*2) + 'px'
    for (let i = 0; i < listDivEl.value.children.length; i++) {
        const listItemEl = listDivEl.value.children[i]
        // @ts-ignore
        listItemEl.style.top = childrenPositionList.value[i].top + 'px'
        // @ts-ignore
        listItemEl.style.left = childrenPositionList.value[i].left + 'px'

    }
}

// 可以实现 100ms 内没有再被触发时才执行 calculateChildPosition()
let resizeTimeoutInterval: number | null = null
function callCalculateChildPosition() {
    if (resizeTimeoutInterval === null) { calculateChildPosition(); resizeTimeoutInterval = -1; return }

    if (resizeTimeoutInterval) {
        clearTimeout(resizeTimeoutInterval)
    }
    resizeTimeoutInterval = setTimeout(() => {
        calculateChildPosition()
    }, 80)
}

onMounted(()=>{
    // 第一次运行计算 监听元素大小变化会调用一次，所以这里不需要调用
    // calculateChildPosition()

    // 监听窗口大小变化 -> 重新计算
    window.addEventListener('resize', callCalculateChildPosition)

    // 监听props变化 -> 重新计算
    watch(() => props, () => {
        // calculateChildPosition()
        callCalculateChildPosition()
    }, {deep: true})

    // 监听子元素大小变化 -> 重新计算
    if (!listDivEl.value || listDivEl.value.children.length===0) return
    for (const listItemEl of Array.from(listDivEl.value.children)) {
        resizeObserver.observe(listItemEl)
    }

    // 元素个数变化 -> 重新计算
    // 配置观察选项：监听子节点变化
    mutationObserver.observe(listDivEl.value, {
        childList: true,  // 观察直接子节点
        // subtree: true, // 观察所有后代节点
    });

})

onBeforeUnmount(()=>{
    // 移除监听
    window.removeEventListener('resize', callCalculateChildPosition)
    resizeObserver.disconnect()
    mutationObserver.disconnect()
})
</script>

<template>
<div ref="listDivEl">
    <slot></slot>
</div>
</template>

<style>
.list-item-with-animation {
    position: absolute !important;
    transition: top 0.3s, left 0.3s !important;
}
</style>
