export interface Token {
    name: string,
    icon: string,
    badge: string | null,
}

// const btc: Token = {
//     name: 'btc',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/btc.svg",
//     badge: null,
// }

// const eth: Token = {
//     name: 'eth',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/eth.svg",
//     badge: "ETH ⚠️NOT BSC⚠️",
// }

const xmr: Token = {
    name: 'xmr',
    icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/xmr.svg",
    badge: null,
}

const usdtTron: Token = {
    name: 'usdttrc20',
    icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdt.svg",
    badge: 'TRON'
}

// const usdtEthereum: Token = {
//     name: 'usdterc20',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdt.svg",
//     badge: 'ETH'
// }

// const usdtOmni: Token = {
//     name: 'usdt',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdt.svg",
//     badge: 'OMNI'
// }

// const usdcEthereum: Token = {
//     name: 'usdc',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdc.svg",
//     badge: 'ETH',
// }

// const usdcSolana: Token = {
//     name: 'usdcsol',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdc.svg",
//     badge: 'SOLANA',
// }

// const usdcTron: Token = {
//     name: 'usdctrc20',
//     icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/usdc.svg",
//     badge: 'TRON',
// }

const doge: Token = {
    name: 'doge',
    icon: "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.16.1/svg/color/doge.svg",
    badge: null,
}


export const tokens: Token[] = [xmr, usdtTron, doge];
