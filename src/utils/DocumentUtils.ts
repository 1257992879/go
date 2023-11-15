export function hideSlider() {
    if (window.innerWidth-document.body.clientWidth !==0) {
        document.body.style.setProperty('width', `calc(100% - ${window.innerWidth-document.body.clientWidth}px)`)
    }
    document.body.style.setProperty('overflow', 'hidden')
}

export function showSlider() {
    document.body.style.removeProperty('width')
    document.body.style.removeProperty('overflow')
}
