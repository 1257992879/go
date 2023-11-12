export type WebsiteItem = {
    link: string,
    vpnLink?: string,
    imageUrl: string,
    name: string,
    desc: string,
    accessWay: string
}

export type WebsiteItemType = {
    titleIconName: string,
    title: string,
    list: WebsiteItem[]
}


export type WebsiteList = WebsiteItemType[]
