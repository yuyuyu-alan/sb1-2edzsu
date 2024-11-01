import './js/libs/weapp-adapter'
import './js/libs/symbol'

const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

import { Game } from './js/main'

// 初始化游戏
new Game(canvas)