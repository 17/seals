import helpers from './utils/helpers'

const APPID = 501004106
const LOGIN_PAGE_PARAM = {
  daid: 164
  , target: 'self'
  , style: 16
  , mibao_css: 'm_webqq'
  , appid: 501004106
  , enable_qlogin: 0
  , no_verifyimg: 1
  , s_url: 'http://w.qq.com/proxy.html'
  , f_url: 'loginerroralert'
  , strong_login: 1
  , login_state: 10
  , t: 20131024001
}
const WINDOW_VALUE = {
  g_begTime: new Date()
  , g_version: '201203081004'
  , g_pt_version: '10143'
  , g_qtarget: '-1'
  , isLoadVC: false
  , g_appid: '501004106'
  , g_uin: 0
  , g_domain: 'qq.com'
  , g_target: '_self'
  , g_https: true
  , g_low_login: '0'
  , g_login_sig: ''
  , g_daid: ''
  , g_regmaster: ''
  , g_forget: 'http://ptlogin2.qq.com/ptui_forgetpwd'
  , g_href: 'https://ui.ptlogin2.qq.com/cgi-bin/login??daid=164&target=self&style=16&mibao_css=m_webqq&appid=501004106&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fw.qq.com%2Fproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20131024001'
  , g_param: ''
  , g_css: ''
  , g_ptcss: ''
  , g_jumpname: ''
  , g_mibao_css: 'm_webqq'
  , g_style: '16'
  , _hide_domain: false
  , _hide_uin_tip: false
  , _verify_img: true
}
const FORM_VALUE = {
  webqq_type: '10'
  , remember_uin: '1'
  , login2qq: '1'
  , aid: '501004106'
  // , u1: 'http://w.qq.com/proxy.html'
  , u1: 'http://w.qq.com/proxy.html?login2qq=1&webqq_type=10'
  , fp: 'loginerroralert'
  , h: '1'
  , ptredirect: '0'
  , ptlang: '2052'
  , from_ui: '1'
  , pttype: '1'
  , dumy: ''
}
const PT = {
  uin: 0
  , salt: ''
  , ckNum: {}
  , action: [0, 0]
  , submitN: {}
  , err_m: null
  , isHttps: !1
  , isIpad: !1
  , mibao_css: ''
  , needAt: ''
  , t_appid: 46000101
  , seller_id: 703010802
  , needCodeTip: !1
  , regmaster: 0
  , qrlogin_step: 0
  , qrlogin_clock: 0
  , qrlogin_timeout: 0
  , qrlogin_timeout_time: 12e4
  , isQrLogin: !1
  , qr_uin: ''
  , qr_nick: ''
  , dftImg: 'http://imgcache.qq.com/ptlogin/face/1.png'
  , js_type: 0
  , pt_verifysession: ''
  , cntCheckTimeout: 0
}
const LOGIN_PARAM = {
  fp: 'loginerroralert'
  // , action: PT.action.join("-") + "-" + (new Date() - WINDOW_VALUE.g_begTime)
  // , mibao_css: PT.mibao_css
  , mibao_css: WINDOW_VALUE.g_mibao_css
  , t: PT.submitN[PT.uin]
  , g: 1
  , js_type: PT.js_type
  , js_ver: WINDOW_VALUE.g_pt_version
  , login_sig: WINDOW_VALUE.g_login_sig
  , pt_randsalt: PT.isRandSalt || 0
}
const ROAM_LOGIN_PUBLICKEY = 'C7715BD43123CB49A48A84006D94215933EC9AE850582D3D3BB5306DDB7BE3D7A5144240FE584F16B89E1124A66BF37B383458E09B56A15E671B707A5A435220950DEAFBBACE54CB1524E23819A8BD8AD9E6AD1CC1A4C20CC4BD2F77327128B05C1689EC550E36D2B93B91BC802537FB527E7824DE0D2F71BC649B557209C7B3'

const loginQRURL = () => 'https://ssl.ptlogin2.qq.com/ptqrshow?regmaster=2&appid=' + APPID + '&e=0&l=M&s=5&d=72&v=4&t=' + Math.random()
const loginPageURL = () => helpers.buildURL('https://ui.ptlogin2.qq.com/cgi-bin/login', LOGIN_PAGE_PARAM)
const checkLoginURL = () => helpers.buildURL('https://ssl.ptlogin2.qq.com/ptqrlogin', Object.assign(FORM_VALUE, LOGIN_PARAM))
const checkVersionURL = () => 'https://ui.ptlogin2.qq.com/ptui_ver.js?ptui_identifier=000D3EED6BC356D218375E906917F79F1CDE079557F46156492D0F2C&v=' + Math.random()
const roamLoginURL = () => 'http://verify.qq.com/cgi-bin/set_pwd2c'
const friendListURL = () => 'http://verify.qq.com/cgi-bin/fri_list'
const uuidIMGURL = () => 'http://verify.qq.com/cgi-bin/getFTNPicture'
const roaminfoURL = () => 'http://verify.qq.com/cgi-bin/getroaminfo'
const chatHistoryURL = () => 'https://ssl.qq.com/verify/cgi-bin/getviproammsg'

export default {
  APPID
  , LOGIN_PAGE_PARAM
  , WINDOW_VALUE
  , FORM_VALUE
  , PT
  , LOGIN_PARAM
  , ROAM_LOGIN_PUBLICKEY
  , loginQRURL
  , loginPageURL
  , checkLoginURL
  , checkVersionURL
  , roamLoginURL
  , friendListURL
  , uuidIMGURL
  , roaminfoURL
  , chatHistoryURL
}
