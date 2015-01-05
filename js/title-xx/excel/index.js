var XLSX = require('xlsx'),
    months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];



// {{{ format constants
var XF_L = module.exports.XF_L = 0;
var XF_C = module.exports.XF_C = 1;
var XF_R = module.exports.XF_R = 2;
var XF_b_L = module.exports.XF_b_L = 3;
var XF_b_C = module.exports.XF_b_C = 4;
var XF_b_R = module.exports.XF_b_R = 5;
var XF_B_L = module.exports.XF_B_L = 6;
var XF_B_C = module.exports.XF_B_C = 7;
var XF_B_R = module.exports.XF_B_R = 8;
var XF_t_L = module.exports.XF_t_L = 9;
var XF_t_C = module.exports.XF_t_C = 10;
var XF_t_R = module.exports.XF_t_R = 11;
var XF_tb_L = module.exports.XF_tb_L = 12;
var XF_tb_C = module.exports.XF_tb_C = 13;
var XF_tb_R = module.exports.XF_tb_R = 14;
var XF_tB_L = module.exports.XF_tB_L = 15;
var XF_tB_C = module.exports.XF_tB_C = 16;
var XF_tB_R = module.exports.XF_tB_R = 17;
var XF_T_L = module.exports.XF_T_L = 18;
var XF_T_C = module.exports.XF_T_C = 19;
var XF_T_R = module.exports.XF_T_R = 20;
var XF_Tb_L = module.exports.XF_Tb_L = 21;
var XF_Tb_C = module.exports.XF_Tb_C = 22;
var XF_Tb_R = module.exports.XF_Tb_R = 23;
var XF_TB_L = module.exports.XF_TB_L = 24;
var XF_TB_C = module.exports.XF_TB_C = 25;
var XF_TB_R = module.exports.XF_TB_R = 26;
var XF_r_L = module.exports.XF_r_L = 27;
var XF_r_C = module.exports.XF_r_C = 28;
var XF_r_R = module.exports.XF_r_R = 29;
var XF_rb_L = module.exports.XF_rb_L = 30;
var XF_rb_C = module.exports.XF_rb_C = 31;
var XF_rb_R = module.exports.XF_rb_R = 32;
var XF_rB_L = module.exports.XF_rB_L = 33;
var XF_rB_C = module.exports.XF_rB_C = 34;
var XF_rB_R = module.exports.XF_rB_R = 35;
var XF_rt_L = module.exports.XF_rt_L = 36;
var XF_rt_C = module.exports.XF_rt_C = 37;
var XF_rt_R = module.exports.XF_rt_R = 38;
var XF_rtb_L = module.exports.XF_rtb_L = 39;
var XF_rtb_C = module.exports.XF_rtb_C = 40;
var XF_rtb_R = module.exports.XF_rtb_R = 41;
var XF_rtB_L = module.exports.XF_rtB_L = 42;
var XF_rtB_C = module.exports.XF_rtB_C = 43;
var XF_rtB_R = module.exports.XF_rtB_R = 44;
var XF_rT_L = module.exports.XF_rT_L = 45;
var XF_rT_C = module.exports.XF_rT_C = 46;
var XF_rT_R = module.exports.XF_rT_R = 47;
var XF_rTb_L = module.exports.XF_rTb_L = 48;
var XF_rTb_C = module.exports.XF_rTb_C = 49;
var XF_rTb_R = module.exports.XF_rTb_R = 50;
var XF_rTB_L = module.exports.XF_rTB_L = 51;
var XF_rTB_C = module.exports.XF_rTB_C = 52;
var XF_rTB_R = module.exports.XF_rTB_R = 53;
var XF_R_L = module.exports.XF_R_L = 54;
var XF_R_C = module.exports.XF_R_C = 55;
var XF_R_R = module.exports.XF_R_R = 56;
var XF_Rb_L = module.exports.XF_Rb_L = 57;
var XF_Rb_C = module.exports.XF_Rb_C = 58;
var XF_Rb_R = module.exports.XF_Rb_R = 59;
var XF_RB_L = module.exports.XF_RB_L = 60;
var XF_RB_C = module.exports.XF_RB_C = 61;
var XF_RB_R = module.exports.XF_RB_R = 62;
var XF_Rt_L = module.exports.XF_Rt_L = 63;
var XF_Rt_C = module.exports.XF_Rt_C = 64;
var XF_Rt_R = module.exports.XF_Rt_R = 65;
var XF_Rtb_L = module.exports.XF_Rtb_L = 66;
var XF_Rtb_C = module.exports.XF_Rtb_C = 67;
var XF_Rtb_R = module.exports.XF_Rtb_R = 68;
var XF_RtB_L = module.exports.XF_RtB_L = 69;
var XF_RtB_C = module.exports.XF_RtB_C = 70;
var XF_RtB_R = module.exports.XF_RtB_R = 71;
var XF_RT_L = module.exports.XF_RT_L = 72;
var XF_RT_C = module.exports.XF_RT_C = 73;
var XF_RT_R = module.exports.XF_RT_R = 74;
var XF_RTb_L = module.exports.XF_RTb_L = 75;
var XF_RTb_C = module.exports.XF_RTb_C = 76;
var XF_RTb_R = module.exports.XF_RTb_R = 77;
var XF_RTB_L = module.exports.XF_RTB_L = 78;
var XF_RTB_C = module.exports.XF_RTB_C = 79;
var XF_RTB_R = module.exports.XF_RTB_R = 80;
var XF_l_L = module.exports.XF_l_L = 81;
var XF_l_C = module.exports.XF_l_C = 82;
var XF_l_R = module.exports.XF_l_R = 83;
var XF_lb_L = module.exports.XF_lb_L = 84;
var XF_lb_C = module.exports.XF_lb_C = 85;
var XF_lb_R = module.exports.XF_lb_R = 86;
var XF_lB_L = module.exports.XF_lB_L = 87;
var XF_lB_C = module.exports.XF_lB_C = 88;
var XF_lB_R = module.exports.XF_lB_R = 89;
var XF_lt_L = module.exports.XF_lt_L = 90;
var XF_lt_C = module.exports.XF_lt_C = 91;
var XF_lt_R = module.exports.XF_lt_R = 92;
var XF_ltb_L = module.exports.XF_ltb_L = 93;
var XF_ltb_C = module.exports.XF_ltb_C = 94;
var XF_ltb_R = module.exports.XF_ltb_R = 95;
var XF_ltB_L = module.exports.XF_ltB_L = 96;
var XF_ltB_C = module.exports.XF_ltB_C = 97;
var XF_ltB_R = module.exports.XF_ltB_R = 98;
var XF_lT_L = module.exports.XF_lT_L = 99;
var XF_lT_C = module.exports.XF_lT_C = 100;
var XF_lT_R = module.exports.XF_lT_R = 101;
var XF_lTb_L = module.exports.XF_lTb_L = 102;
var XF_lTb_C = module.exports.XF_lTb_C = 103;
var XF_lTb_R = module.exports.XF_lTb_R = 104;
var XF_lTB_L = module.exports.XF_lTB_L = 105;
var XF_lTB_C = module.exports.XF_lTB_C = 106;
var XF_lTB_R = module.exports.XF_lTB_R = 107;
var XF_lr_L = module.exports.XF_lr_L = 108;
var XF_lr_C = module.exports.XF_lr_C = 109;
var XF_lr_R = module.exports.XF_lr_R = 110;
var XF_lrb_L = module.exports.XF_lrb_L = 111;
var XF_lrb_C = module.exports.XF_lrb_C = 112;
var XF_lrb_R = module.exports.XF_lrb_R = 113;
var XF_lrB_L = module.exports.XF_lrB_L = 114;
var XF_lrB_C = module.exports.XF_lrB_C = 115;
var XF_lrB_R = module.exports.XF_lrB_R = 116;
var XF_lrt_L = module.exports.XF_lrt_L = 117;
var XF_lrt_C = module.exports.XF_lrt_C = 118;
var XF_lrt_R = module.exports.XF_lrt_R = 119;
var XF_lrtb_L = module.exports.XF_lrtb_L = 120;
var XF_lrtb_C = module.exports.XF_lrtb_C = 121;
var XF_lrtb_R = module.exports.XF_lrtb_R = 122;
var XF_lrtB_L = module.exports.XF_lrtB_L = 123;
var XF_lrtB_C = module.exports.XF_lrtB_C = 124;
var XF_lrtB_R = module.exports.XF_lrtB_R = 125;
var XF_lrT_L = module.exports.XF_lrT_L = 126;
var XF_lrT_C = module.exports.XF_lrT_C = 127;
var XF_lrT_R = module.exports.XF_lrT_R = 128;
var XF_lrTb_L = module.exports.XF_lrTb_L = 129;
var XF_lrTb_C = module.exports.XF_lrTb_C = 130;
var XF_lrTb_R = module.exports.XF_lrTb_R = 131;
var XF_lrTB_L = module.exports.XF_lrTB_L = 132;
var XF_lrTB_C = module.exports.XF_lrTB_C = 133;
var XF_lrTB_R = module.exports.XF_lrTB_R = 134;
var XF_lR_L = module.exports.XF_lR_L = 135;
var XF_lR_C = module.exports.XF_lR_C = 136;
var XF_lR_R = module.exports.XF_lR_R = 137;
var XF_lRb_L = module.exports.XF_lRb_L = 138;
var XF_lRb_C = module.exports.XF_lRb_C = 139;
var XF_lRb_R = module.exports.XF_lRb_R = 140;
var XF_lRB_L = module.exports.XF_lRB_L = 141;
var XF_lRB_C = module.exports.XF_lRB_C = 142;
var XF_lRB_R = module.exports.XF_lRB_R = 143;
var XF_lRt_L = module.exports.XF_lRt_L = 144;
var XF_lRt_C = module.exports.XF_lRt_C = 145;
var XF_lRt_R = module.exports.XF_lRt_R = 146;
var XF_lRtb_L = module.exports.XF_lRtb_L = 147;
var XF_lRtb_C = module.exports.XF_lRtb_C = 148;
var XF_lRtb_R = module.exports.XF_lRtb_R = 149;
var XF_lRtB_L = module.exports.XF_lRtB_L = 150;
var XF_lRtB_C = module.exports.XF_lRtB_C = 151;
var XF_lRtB_R = module.exports.XF_lRtB_R = 152;
var XF_lRT_L = module.exports.XF_lRT_L = 153;
var XF_lRT_C = module.exports.XF_lRT_C = 154;
var XF_lRT_R = module.exports.XF_lRT_R = 155;
var XF_lRTb_L = module.exports.XF_lRTb_L = 156;
var XF_lRTb_C = module.exports.XF_lRTb_C = 157;
var XF_lRTb_R = module.exports.XF_lRTb_R = 158;
var XF_lRTB_L = module.exports.XF_lRTB_L = 159;
var XF_lRTB_C = module.exports.XF_lRTB_C = 160;
var XF_lRTB_R = module.exports.XF_lRTB_R = 161;
var XF_L_L = module.exports.XF_L_L = 162;
var XF_L_C = module.exports.XF_L_C = 163;
var XF_L_R = module.exports.XF_L_R = 164;
var XF_Lb_L = module.exports.XF_Lb_L = 165;
var XF_Lb_C = module.exports.XF_Lb_C = 166;
var XF_Lb_R = module.exports.XF_Lb_R = 167;
var XF_LB_L = module.exports.XF_LB_L = 168;
var XF_LB_C = module.exports.XF_LB_C = 169;
var XF_LB_R = module.exports.XF_LB_R = 170;
var XF_Lt_L = module.exports.XF_Lt_L = 171;
var XF_Lt_C = module.exports.XF_Lt_C = 172;
var XF_Lt_R = module.exports.XF_Lt_R = 173;
var XF_Ltb_L = module.exports.XF_Ltb_L = 174;
var XF_Ltb_C = module.exports.XF_Ltb_C = 175;
var XF_Ltb_R = module.exports.XF_Ltb_R = 176;
var XF_LtB_L = module.exports.XF_LtB_L = 177;
var XF_LtB_C = module.exports.XF_LtB_C = 178;
var XF_LtB_R = module.exports.XF_LtB_R = 179;
var XF_LT_L = module.exports.XF_LT_L = 180;
var XF_LT_C = module.exports.XF_LT_C = 181;
var XF_LT_R = module.exports.XF_LT_R = 182;
var XF_LTb_L = module.exports.XF_LTb_L = 183;
var XF_LTb_C = module.exports.XF_LTb_C = 184;
var XF_LTb_R = module.exports.XF_LTb_R = 185;
var XF_LTB_L = module.exports.XF_LTB_L = 186;
var XF_LTB_C = module.exports.XF_LTB_C = 187;
var XF_LTB_R = module.exports.XF_LTB_R = 188;
var XF_Lr_L = module.exports.XF_Lr_L = 189;
var XF_Lr_C = module.exports.XF_Lr_C = 190;
var XF_Lr_R = module.exports.XF_Lr_R = 191;
var XF_Lrb_L = module.exports.XF_Lrb_L = 192;
var XF_Lrb_C = module.exports.XF_Lrb_C = 193;
var XF_Lrb_R = module.exports.XF_Lrb_R = 194;
var XF_LrB_L = module.exports.XF_LrB_L = 195;
var XF_LrB_C = module.exports.XF_LrB_C = 196;
var XF_LrB_R = module.exports.XF_LrB_R = 197;
var XF_Lrt_L = module.exports.XF_Lrt_L = 198;
var XF_Lrt_C = module.exports.XF_Lrt_C = 199;
var XF_Lrt_R = module.exports.XF_Lrt_R = 200;
var XF_Lrtb_L = module.exports.XF_Lrtb_L = 201;
var XF_Lrtb_C = module.exports.XF_Lrtb_C = 202;
var XF_Lrtb_R = module.exports.XF_Lrtb_R = 203;
var XF_LrtB_L = module.exports.XF_LrtB_L = 204;
var XF_LrtB_C = module.exports.XF_LrtB_C = 205;
var XF_LrtB_R = module.exports.XF_LrtB_R = 206;
var XF_LrT_L = module.exports.XF_LrT_L = 207;
var XF_LrT_C = module.exports.XF_LrT_C = 208;
var XF_LrT_R = module.exports.XF_LrT_R = 209;
var XF_LrTb_L = module.exports.XF_LrTb_L = 210;
var XF_LrTb_C = module.exports.XF_LrTb_C = 211;
var XF_LrTb_R = module.exports.XF_LrTb_R = 212;
var XF_LrTB_L = module.exports.XF_LrTB_L = 213;
var XF_LrTB_C = module.exports.XF_LrTB_C = 214;
var XF_LrTB_R = module.exports.XF_LrTB_R = 215;
var XF_LR_L = module.exports.XF_LR_L = 216;
var XF_LR_C = module.exports.XF_LR_C = 217;
var XF_LR_R = module.exports.XF_LR_R = 218;
var XF_LRb_L = module.exports.XF_LRb_L = 219;
var XF_LRb_C = module.exports.XF_LRb_C = 220;
var XF_LRb_R = module.exports.XF_LRb_R = 221;
var XF_LRB_L = module.exports.XF_LRB_L = 222;
var XF_LRB_C = module.exports.XF_LRB_C = 223;
var XF_LRB_R = module.exports.XF_LRB_R = 224;
var XF_LRt_L = module.exports.XF_LRt_L = 225;
var XF_LRt_C = module.exports.XF_LRt_C = 226;
var XF_LRt_R = module.exports.XF_LRt_R = 227;
var XF_LRtb_L = module.exports.XF_LRtb_L = 228;
var XF_LRtb_C = module.exports.XF_LRtb_C = 229;
var XF_LRtb_R = module.exports.XF_LRtb_R = 230;
var XF_LRtB_L = module.exports.XF_LRtB_L = 231;
var XF_LRtB_C = module.exports.XF_LRtB_C = 232;
var XF_LRtB_R = module.exports.XF_LRtB_R = 233;
var XF_LRT_L = module.exports.XF_LRT_L = 234;
var XF_LRT_C = module.exports.XF_LRT_C = 235;
var XF_LRT_R = module.exports.XF_LRT_R = 236;
var XF_LRTb_L = module.exports.XF_LRTb_L = 237;
var XF_LRTb_C = module.exports.XF_LRTb_C = 238;
var XF_LRTb_R = module.exports.XF_LRTb_R = 239;
var XF_LRTB_L = module.exports.XF_LRTB_L = 240;
var XF_LRTB_C = module.exports.XF_LRTB_C = 241;
var XF_LRTB_R = module.exports.XF_LRTB_R = 242;
var XF_GRAY_L = module.exports.XF_GRAY_L = 243;
var XF_GRAY_C = module.exports.XF_GRAY_C = 244;
var XF_GRAY_R = module.exports.XF_GRAY_R = 245;
var XF_GRAY_b_L = module.exports.XF_GRAY_b_L = 246;
var XF_GRAY_b_C = module.exports.XF_GRAY_b_C = 247;
var XF_GRAY_b_R = module.exports.XF_GRAY_b_R = 248;
var XF_GRAY_B_L = module.exports.XF_GRAY_B_L = 249;
var XF_GRAY_B_C = module.exports.XF_GRAY_B_C = 250;
var XF_GRAY_B_R = module.exports.XF_GRAY_B_R = 251;
var XF_GRAY_t_L = module.exports.XF_GRAY_t_L = 252;
var XF_GRAY_t_C = module.exports.XF_GRAY_t_C = 253;
var XF_GRAY_t_R = module.exports.XF_GRAY_t_R = 254;
var XF_GRAY_tb_L = module.exports.XF_GRAY_tb_L = 255;
var XF_GRAY_tb_C = module.exports.XF_GRAY_tb_C = 256;
var XF_GRAY_tb_R = module.exports.XF_GRAY_tb_R = 257;
var XF_GRAY_tB_L = module.exports.XF_GRAY_tB_L = 258;
var XF_GRAY_tB_C = module.exports.XF_GRAY_tB_C = 259;
var XF_GRAY_tB_R = module.exports.XF_GRAY_tB_R = 260;
var XF_GRAY_T_L = module.exports.XF_GRAY_T_L = 261;
var XF_GRAY_T_C = module.exports.XF_GRAY_T_C = 262;
var XF_GRAY_T_R = module.exports.XF_GRAY_T_R = 263;
var XF_GRAY_Tb_L = module.exports.XF_GRAY_Tb_L = 264;
var XF_GRAY_Tb_C = module.exports.XF_GRAY_Tb_C = 265;
var XF_GRAY_Tb_R = module.exports.XF_GRAY_Tb_R = 266;
var XF_GRAY_TB_L = module.exports.XF_GRAY_TB_L = 267;
var XF_GRAY_TB_C = module.exports.XF_GRAY_TB_C = 268;
var XF_GRAY_TB_R = module.exports.XF_GRAY_TB_R = 269;
var XF_GRAY_r_L = module.exports.XF_GRAY_r_L = 270;
var XF_GRAY_r_C = module.exports.XF_GRAY_r_C = 271;
var XF_GRAY_r_R = module.exports.XF_GRAY_r_R = 272;
var XF_GRAY_rb_L = module.exports.XF_GRAY_rb_L = 273;
var XF_GRAY_rb_C = module.exports.XF_GRAY_rb_C = 274;
var XF_GRAY_rb_R = module.exports.XF_GRAY_rb_R = 275;
var XF_GRAY_rB_L = module.exports.XF_GRAY_rB_L = 276;
var XF_GRAY_rB_C = module.exports.XF_GRAY_rB_C = 277;
var XF_GRAY_rB_R = module.exports.XF_GRAY_rB_R = 278;
var XF_GRAY_rt_L = module.exports.XF_GRAY_rt_L = 279;
var XF_GRAY_rt_C = module.exports.XF_GRAY_rt_C = 280;
var XF_GRAY_rt_R = module.exports.XF_GRAY_rt_R = 281;
var XF_GRAY_rtb_L = module.exports.XF_GRAY_rtb_L = 282;
var XF_GRAY_rtb_C = module.exports.XF_GRAY_rtb_C = 283;
var XF_GRAY_rtb_R = module.exports.XF_GRAY_rtb_R = 284;
var XF_GRAY_rtB_L = module.exports.XF_GRAY_rtB_L = 285;
var XF_GRAY_rtB_C = module.exports.XF_GRAY_rtB_C = 286;
var XF_GRAY_rtB_R = module.exports.XF_GRAY_rtB_R = 287;
var XF_GRAY_rT_L = module.exports.XF_GRAY_rT_L = 288;
var XF_GRAY_rT_C = module.exports.XF_GRAY_rT_C = 289;
var XF_GRAY_rT_R = module.exports.XF_GRAY_rT_R = 290;
var XF_GRAY_rTb_L = module.exports.XF_GRAY_rTb_L = 291;
var XF_GRAY_rTb_C = module.exports.XF_GRAY_rTb_C = 292;
var XF_GRAY_rTb_R = module.exports.XF_GRAY_rTb_R = 293;
var XF_GRAY_rTB_L = module.exports.XF_GRAY_rTB_L = 294;
var XF_GRAY_rTB_C = module.exports.XF_GRAY_rTB_C = 295;
var XF_GRAY_rTB_R = module.exports.XF_GRAY_rTB_R = 296;
var XF_GRAY_R_L = module.exports.XF_GRAY_R_L = 297;
var XF_GRAY_R_C = module.exports.XF_GRAY_R_C = 298;
var XF_GRAY_R_R = module.exports.XF_GRAY_R_R = 299;
var XF_GRAY_Rb_L = module.exports.XF_GRAY_Rb_L = 300;
var XF_GRAY_Rb_C = module.exports.XF_GRAY_Rb_C = 301;
var XF_GRAY_Rb_R = module.exports.XF_GRAY_Rb_R = 302;
var XF_GRAY_RB_L = module.exports.XF_GRAY_RB_L = 303;
var XF_GRAY_RB_C = module.exports.XF_GRAY_RB_C = 304;
var XF_GRAY_RB_R = module.exports.XF_GRAY_RB_R = 305;
var XF_GRAY_Rt_L = module.exports.XF_GRAY_Rt_L = 306;
var XF_GRAY_Rt_C = module.exports.XF_GRAY_Rt_C = 307;
var XF_GRAY_Rt_R = module.exports.XF_GRAY_Rt_R = 308;
var XF_GRAY_Rtb_L = module.exports.XF_GRAY_Rtb_L = 309;
var XF_GRAY_Rtb_C = module.exports.XF_GRAY_Rtb_C = 310;
var XF_GRAY_Rtb_R = module.exports.XF_GRAY_Rtb_R = 311;
var XF_GRAY_RtB_L = module.exports.XF_GRAY_RtB_L = 312;
var XF_GRAY_RtB_C = module.exports.XF_GRAY_RtB_C = 313;
var XF_GRAY_RtB_R = module.exports.XF_GRAY_RtB_R = 314;
var XF_GRAY_RT_L = module.exports.XF_GRAY_RT_L = 315;
var XF_GRAY_RT_C = module.exports.XF_GRAY_RT_C = 316;
var XF_GRAY_RT_R = module.exports.XF_GRAY_RT_R = 317;
var XF_GRAY_RTb_L = module.exports.XF_GRAY_RTb_L = 318;
var XF_GRAY_RTb_C = module.exports.XF_GRAY_RTb_C = 319;
var XF_GRAY_RTb_R = module.exports.XF_GRAY_RTb_R = 320;
var XF_GRAY_RTB_L = module.exports.XF_GRAY_RTB_L = 321;
var XF_GRAY_RTB_C = module.exports.XF_GRAY_RTB_C = 322;
var XF_GRAY_RTB_R = module.exports.XF_GRAY_RTB_R = 323;
var XF_GRAY_l_L = module.exports.XF_GRAY_l_L = 324;
var XF_GRAY_l_C = module.exports.XF_GRAY_l_C = 325;
var XF_GRAY_l_R = module.exports.XF_GRAY_l_R = 326;
var XF_GRAY_lb_L = module.exports.XF_GRAY_lb_L = 327;
var XF_GRAY_lb_C = module.exports.XF_GRAY_lb_C = 328;
var XF_GRAY_lb_R = module.exports.XF_GRAY_lb_R = 329;
var XF_GRAY_lB_L = module.exports.XF_GRAY_lB_L = 330;
var XF_GRAY_lB_C = module.exports.XF_GRAY_lB_C = 331;
var XF_GRAY_lB_R = module.exports.XF_GRAY_lB_R = 332;
var XF_GRAY_lt_L = module.exports.XF_GRAY_lt_L = 333;
var XF_GRAY_lt_C = module.exports.XF_GRAY_lt_C = 334;
var XF_GRAY_lt_R = module.exports.XF_GRAY_lt_R = 335;
var XF_GRAY_ltb_L = module.exports.XF_GRAY_ltb_L = 336;
var XF_GRAY_ltb_C = module.exports.XF_GRAY_ltb_C = 337;
var XF_GRAY_ltb_R = module.exports.XF_GRAY_ltb_R = 338;
var XF_GRAY_ltB_L = module.exports.XF_GRAY_ltB_L = 339;
var XF_GRAY_ltB_C = module.exports.XF_GRAY_ltB_C = 340;
var XF_GRAY_ltB_R = module.exports.XF_GRAY_ltB_R = 341;
var XF_GRAY_lT_L = module.exports.XF_GRAY_lT_L = 342;
var XF_GRAY_lT_C = module.exports.XF_GRAY_lT_C = 343;
var XF_GRAY_lT_R = module.exports.XF_GRAY_lT_R = 344;
var XF_GRAY_lTb_L = module.exports.XF_GRAY_lTb_L = 345;
var XF_GRAY_lTb_C = module.exports.XF_GRAY_lTb_C = 346;
var XF_GRAY_lTb_R = module.exports.XF_GRAY_lTb_R = 347;
var XF_GRAY_lTB_L = module.exports.XF_GRAY_lTB_L = 348;
var XF_GRAY_lTB_C = module.exports.XF_GRAY_lTB_C = 349;
var XF_GRAY_lTB_R = module.exports.XF_GRAY_lTB_R = 350;
var XF_GRAY_lr_L = module.exports.XF_GRAY_lr_L = 351;
var XF_GRAY_lr_C = module.exports.XF_GRAY_lr_C = 352;
var XF_GRAY_lr_R = module.exports.XF_GRAY_lr_R = 353;
var XF_GRAY_lrb_L = module.exports.XF_GRAY_lrb_L = 354;
var XF_GRAY_lrb_C = module.exports.XF_GRAY_lrb_C = 355;
var XF_GRAY_lrb_R = module.exports.XF_GRAY_lrb_R = 356;
var XF_GRAY_lrB_L = module.exports.XF_GRAY_lrB_L = 357;
var XF_GRAY_lrB_C = module.exports.XF_GRAY_lrB_C = 358;
var XF_GRAY_lrB_R = module.exports.XF_GRAY_lrB_R = 359;
var XF_GRAY_lrt_L = module.exports.XF_GRAY_lrt_L = 360;
var XF_GRAY_lrt_C = module.exports.XF_GRAY_lrt_C = 361;
var XF_GRAY_lrt_R = module.exports.XF_GRAY_lrt_R = 362;
var XF_GRAY_lrtb_L = module.exports.XF_GRAY_lrtb_L = 363;
var XF_GRAY_lrtb_C = module.exports.XF_GRAY_lrtb_C = 364;
var XF_GRAY_lrtb_R = module.exports.XF_GRAY_lrtb_R = 365;
var XF_GRAY_lrtB_L = module.exports.XF_GRAY_lrtB_L = 366;
var XF_GRAY_lrtB_C = module.exports.XF_GRAY_lrtB_C = 367;
var XF_GRAY_lrtB_R = module.exports.XF_GRAY_lrtB_R = 368;
var XF_GRAY_lrT_L = module.exports.XF_GRAY_lrT_L = 369;
var XF_GRAY_lrT_C = module.exports.XF_GRAY_lrT_C = 370;
var XF_GRAY_lrT_R = module.exports.XF_GRAY_lrT_R = 371;
var XF_GRAY_lrTb_L = module.exports.XF_GRAY_lrTb_L = 372;
var XF_GRAY_lrTb_C = module.exports.XF_GRAY_lrTb_C = 373;
var XF_GRAY_lrTb_R = module.exports.XF_GRAY_lrTb_R = 374;
var XF_GRAY_lrTB_L = module.exports.XF_GRAY_lrTB_L = 375;
var XF_GRAY_lrTB_C = module.exports.XF_GRAY_lrTB_C = 376;
var XF_GRAY_lrTB_R = module.exports.XF_GRAY_lrTB_R = 377;
var XF_GRAY_lR_L = module.exports.XF_GRAY_lR_L = 378;
var XF_GRAY_lR_C = module.exports.XF_GRAY_lR_C = 379;
var XF_GRAY_lR_R = module.exports.XF_GRAY_lR_R = 380;
var XF_GRAY_lRb_L = module.exports.XF_GRAY_lRb_L = 381;
var XF_GRAY_lRb_C = module.exports.XF_GRAY_lRb_C = 382;
var XF_GRAY_lRb_R = module.exports.XF_GRAY_lRb_R = 383;
var XF_GRAY_lRB_L = module.exports.XF_GRAY_lRB_L = 384;
var XF_GRAY_lRB_C = module.exports.XF_GRAY_lRB_C = 385;
var XF_GRAY_lRB_R = module.exports.XF_GRAY_lRB_R = 386;
var XF_GRAY_lRt_L = module.exports.XF_GRAY_lRt_L = 387;
var XF_GRAY_lRt_C = module.exports.XF_GRAY_lRt_C = 388;
var XF_GRAY_lRt_R = module.exports.XF_GRAY_lRt_R = 389;
var XF_GRAY_lRtb_L = module.exports.XF_GRAY_lRtb_L = 390;
var XF_GRAY_lRtb_C = module.exports.XF_GRAY_lRtb_C = 391;
var XF_GRAY_lRtb_R = module.exports.XF_GRAY_lRtb_R = 392;
var XF_GRAY_lRtB_L = module.exports.XF_GRAY_lRtB_L = 393;
var XF_GRAY_lRtB_C = module.exports.XF_GRAY_lRtB_C = 394;
var XF_GRAY_lRtB_R = module.exports.XF_GRAY_lRtB_R = 395;
var XF_GRAY_lRT_L = module.exports.XF_GRAY_lRT_L = 396;
var XF_GRAY_lRT_C = module.exports.XF_GRAY_lRT_C = 397;
var XF_GRAY_lRT_R = module.exports.XF_GRAY_lRT_R = 398;
var XF_GRAY_lRTb_L = module.exports.XF_GRAY_lRTb_L = 399;
var XF_GRAY_lRTb_C = module.exports.XF_GRAY_lRTb_C = 400;
var XF_GRAY_lRTb_R = module.exports.XF_GRAY_lRTb_R = 401;
var XF_GRAY_lRTB_L = module.exports.XF_GRAY_lRTB_L = 402;
var XF_GRAY_lRTB_C = module.exports.XF_GRAY_lRTB_C = 403;
var XF_GRAY_lRTB_R = module.exports.XF_GRAY_lRTB_R = 404;
var XF_GRAY_L_L = module.exports.XF_GRAY_L_L = 405;
var XF_GRAY_L_C = module.exports.XF_GRAY_L_C = 406;
var XF_GRAY_L_R = module.exports.XF_GRAY_L_R = 407;
var XF_GRAY_Lb_L = module.exports.XF_GRAY_Lb_L = 408;
var XF_GRAY_Lb_C = module.exports.XF_GRAY_Lb_C = 409;
var XF_GRAY_Lb_R = module.exports.XF_GRAY_Lb_R = 410;
var XF_GRAY_LB_L = module.exports.XF_GRAY_LB_L = 411;
var XF_GRAY_LB_C = module.exports.XF_GRAY_LB_C = 412;
var XF_GRAY_LB_R = module.exports.XF_GRAY_LB_R = 413;
var XF_GRAY_Lt_L = module.exports.XF_GRAY_Lt_L = 414;
var XF_GRAY_Lt_C = module.exports.XF_GRAY_Lt_C = 415;
var XF_GRAY_Lt_R = module.exports.XF_GRAY_Lt_R = 416;
var XF_GRAY_Ltb_L = module.exports.XF_GRAY_Ltb_L = 417;
var XF_GRAY_Ltb_C = module.exports.XF_GRAY_Ltb_C = 418;
var XF_GRAY_Ltb_R = module.exports.XF_GRAY_Ltb_R = 419;
var XF_GRAY_LtB_L = module.exports.XF_GRAY_LtB_L = 420;
var XF_GRAY_LtB_C = module.exports.XF_GRAY_LtB_C = 421;
var XF_GRAY_LtB_R = module.exports.XF_GRAY_LtB_R = 422;
var XF_GRAY_LT_L = module.exports.XF_GRAY_LT_L = 423;
var XF_GRAY_LT_C = module.exports.XF_GRAY_LT_C = 424;
var XF_GRAY_LT_R = module.exports.XF_GRAY_LT_R = 425;
var XF_GRAY_LTb_L = module.exports.XF_GRAY_LTb_L = 426;
var XF_GRAY_LTb_C = module.exports.XF_GRAY_LTb_C = 427;
var XF_GRAY_LTb_R = module.exports.XF_GRAY_LTb_R = 428;
var XF_GRAY_LTB_L = module.exports.XF_GRAY_LTB_L = 429;
var XF_GRAY_LTB_C = module.exports.XF_GRAY_LTB_C = 430;
var XF_GRAY_LTB_R = module.exports.XF_GRAY_LTB_R = 431;
var XF_GRAY_Lr_L = module.exports.XF_GRAY_Lr_L = 432;
var XF_GRAY_Lr_C = module.exports.XF_GRAY_Lr_C = 433;
var XF_GRAY_Lr_R = module.exports.XF_GRAY_Lr_R = 434;
var XF_GRAY_Lrb_L = module.exports.XF_GRAY_Lrb_L = 435;
var XF_GRAY_Lrb_C = module.exports.XF_GRAY_Lrb_C = 436;
var XF_GRAY_Lrb_R = module.exports.XF_GRAY_Lrb_R = 437;
var XF_GRAY_LrB_L = module.exports.XF_GRAY_LrB_L = 438;
var XF_GRAY_LrB_C = module.exports.XF_GRAY_LrB_C = 439;
var XF_GRAY_LrB_R = module.exports.XF_GRAY_LrB_R = 440;
var XF_GRAY_Lrt_L = module.exports.XF_GRAY_Lrt_L = 441;
var XF_GRAY_Lrt_C = module.exports.XF_GRAY_Lrt_C = 442;
var XF_GRAY_Lrt_R = module.exports.XF_GRAY_Lrt_R = 443;
var XF_GRAY_Lrtb_L = module.exports.XF_GRAY_Lrtb_L = 444;
var XF_GRAY_Lrtb_C = module.exports.XF_GRAY_Lrtb_C = 445;
var XF_GRAY_Lrtb_R = module.exports.XF_GRAY_Lrtb_R = 446;
var XF_GRAY_LrtB_L = module.exports.XF_GRAY_LrtB_L = 447;
var XF_GRAY_LrtB_C = module.exports.XF_GRAY_LrtB_C = 448;
var XF_GRAY_LrtB_R = module.exports.XF_GRAY_LrtB_R = 449;
var XF_GRAY_LrT_L = module.exports.XF_GRAY_LrT_L = 450;
var XF_GRAY_LrT_C = module.exports.XF_GRAY_LrT_C = 451;
var XF_GRAY_LrT_R = module.exports.XF_GRAY_LrT_R = 452;
var XF_GRAY_LrTb_L = module.exports.XF_GRAY_LrTb_L = 453;
var XF_GRAY_LrTb_C = module.exports.XF_GRAY_LrTb_C = 454;
var XF_GRAY_LrTb_R = module.exports.XF_GRAY_LrTb_R = 455;
var XF_GRAY_LrTB_L = module.exports.XF_GRAY_LrTB_L = 456;
var XF_GRAY_LrTB_C = module.exports.XF_GRAY_LrTB_C = 457;
var XF_GRAY_LrTB_R = module.exports.XF_GRAY_LrTB_R = 458;
var XF_GRAY_LR_L = module.exports.XF_GRAY_LR_L = 459;
var XF_GRAY_LR_C = module.exports.XF_GRAY_LR_C = 460;
var XF_GRAY_LR_R = module.exports.XF_GRAY_LR_R = 461;
var XF_GRAY_LRb_L = module.exports.XF_GRAY_LRb_L = 462;
var XF_GRAY_LRb_C = module.exports.XF_GRAY_LRb_C = 463;
var XF_GRAY_LRb_R = module.exports.XF_GRAY_LRb_R = 464;
var XF_GRAY_LRB_L = module.exports.XF_GRAY_LRB_L = 465;
var XF_GRAY_LRB_C = module.exports.XF_GRAY_LRB_C = 466;
var XF_GRAY_LRB_R = module.exports.XF_GRAY_LRB_R = 467;
var XF_GRAY_LRt_L = module.exports.XF_GRAY_LRt_L = 468;
var XF_GRAY_LRt_C = module.exports.XF_GRAY_LRt_C = 469;
var XF_GRAY_LRt_R = module.exports.XF_GRAY_LRt_R = 470;
var XF_GRAY_LRtb_L = module.exports.XF_GRAY_LRtb_L = 471;
var XF_GRAY_LRtb_C = module.exports.XF_GRAY_LRtb_C = 472;
var XF_GRAY_LRtb_R = module.exports.XF_GRAY_LRtb_R = 473;
var XF_GRAY_LRtB_L = module.exports.XF_GRAY_LRtB_L = 474;
var XF_GRAY_LRtB_C = module.exports.XF_GRAY_LRtB_C = 475;
var XF_GRAY_LRtB_R = module.exports.XF_GRAY_LRtB_R = 476;
var XF_GRAY_LRT_L = module.exports.XF_GRAY_LRT_L = 477;
var XF_GRAY_LRT_C = module.exports.XF_GRAY_LRT_C = 478;
var XF_GRAY_LRT_R = module.exports.XF_GRAY_LRT_R = 479;
var XF_GRAY_LRTb_L = module.exports.XF_GRAY_LRTb_L = 480;
var XF_GRAY_LRTb_C = module.exports.XF_GRAY_LRTb_C = 481;
var XF_GRAY_LRTb_R = module.exports.XF_GRAY_LRTb_R = 482;
var XF_GRAY_LRTB_L = module.exports.XF_GRAY_LRTB_L = 483;
var XF_GRAY_LRTB_C = module.exports.XF_GRAY_LRTB_C = 484;
var XF_GRAY_LRTB_R = module.exports.XF_GRAY_LRTB_R = 485;
var XF_B10_L = module.exports.XF_B10_L = 486;
var XF_B10_C = module.exports.XF_B10_C = 487;
var XF_B10_R = module.exports.XF_B10_R = 488;
var XF_B10_b_L = module.exports.XF_B10_b_L = 489;
var XF_B10_b_C = module.exports.XF_B10_b_C = 490;
var XF_B10_b_R = module.exports.XF_B10_b_R = 491;
var XF_B10_B_L = module.exports.XF_B10_B_L = 492;
var XF_B10_B_C = module.exports.XF_B10_B_C = 493;
var XF_B10_B_R = module.exports.XF_B10_B_R = 494;
var XF_B10_t_L = module.exports.XF_B10_t_L = 495;
var XF_B10_t_C = module.exports.XF_B10_t_C = 496;
var XF_B10_t_R = module.exports.XF_B10_t_R = 497;
var XF_B10_tb_L = module.exports.XF_B10_tb_L = 498;
var XF_B10_tb_C = module.exports.XF_B10_tb_C = 499;
var XF_B10_tb_R = module.exports.XF_B10_tb_R = 500;
var XF_B10_tB_L = module.exports.XF_B10_tB_L = 501;
var XF_B10_tB_C = module.exports.XF_B10_tB_C = 502;
var XF_B10_tB_R = module.exports.XF_B10_tB_R = 503;
var XF_B10_T_L = module.exports.XF_B10_T_L = 504;
var XF_B10_T_C = module.exports.XF_B10_T_C = 505;
var XF_B10_T_R = module.exports.XF_B10_T_R = 506;
var XF_B10_Tb_L = module.exports.XF_B10_Tb_L = 5.5;
var XF_B10_Tb_C = module.exports.XF_B10_Tb_C = 508;
var XF_B10_Tb_R = module.exports.XF_B10_Tb_R = 509;
var XF_B10_TB_L = module.exports.XF_B10_TB_L = 510;
var XF_B10_TB_C = module.exports.XF_B10_TB_C = 511;
var XF_B10_TB_R = module.exports.XF_B10_TB_R = 512;
var XF_B10_r_L = module.exports.XF_B10_r_L = 513;
var XF_B10_r_C = module.exports.XF_B10_r_C = 514;
var XF_B10_r_R = module.exports.XF_B10_r_R = 515;
var XF_B10_rb_L = module.exports.XF_B10_rb_L = 516;
var XF_B10_rb_C = module.exports.XF_B10_rb_C = 5.5;
var XF_B10_rb_R = module.exports.XF_B10_rb_R = 518;
var XF_B10_rB_L = module.exports.XF_B10_rB_L = 519;
var XF_B10_rB_C = module.exports.XF_B10_rB_C = 520;
var XF_B10_rB_R = module.exports.XF_B10_rB_R = 521;
var XF_B10_rt_L = module.exports.XF_B10_rt_L = 522;
var XF_B10_rt_C = module.exports.XF_B10_rt_C = 523;
var XF_B10_rt_R = module.exports.XF_B10_rt_R = 524;
var XF_B10_rtb_L = module.exports.XF_B10_rtb_L = 525;
var XF_B10_rtb_C = module.exports.XF_B10_rtb_C = 526;
var XF_B10_rtb_R = module.exports.XF_B10_rtb_R = 5.5;
var XF_B10_rtB_L = module.exports.XF_B10_rtB_L = 528;
var XF_B10_rtB_C = module.exports.XF_B10_rtB_C = 529;
var XF_B10_rtB_R = module.exports.XF_B10_rtB_R = 530;
var XF_B10_rT_L = module.exports.XF_B10_rT_L = 531;
var XF_B10_rT_C = module.exports.XF_B10_rT_C = 532;
var XF_B10_rT_R = module.exports.XF_B10_rT_R = 533;
var XF_B10_rTb_L = module.exports.XF_B10_rTb_L = 534;
var XF_B10_rTb_C = module.exports.XF_B10_rTb_C = 535;
var XF_B10_rTb_R = module.exports.XF_B10_rTb_R = 536;
var XF_B10_rTB_L = module.exports.XF_B10_rTB_L = 5.5;
var XF_B10_rTB_C = module.exports.XF_B10_rTB_C = 538;
var XF_B10_rTB_R = module.exports.XF_B10_rTB_R = 539;
var XF_B10_R_L = module.exports.XF_B10_R_L = 540;
var XF_B10_R_C = module.exports.XF_B10_R_C = 541;
var XF_B10_R_R = module.exports.XF_B10_R_R = 542;
var XF_B10_Rb_L = module.exports.XF_B10_Rb_L = 543;
var XF_B10_Rb_C = module.exports.XF_B10_Rb_C = 544;
var XF_B10_Rb_R = module.exports.XF_B10_Rb_R = 545;
var XF_B10_RB_L = module.exports.XF_B10_RB_L = 546;
var XF_B10_RB_C = module.exports.XF_B10_RB_C = 5.5;
var XF_B10_RB_R = module.exports.XF_B10_RB_R = 548;
var XF_B10_Rt_L = module.exports.XF_B10_Rt_L = 549;
var XF_B10_Rt_C = module.exports.XF_B10_Rt_C = 550;
var XF_B10_Rt_R = module.exports.XF_B10_Rt_R = 551;
var XF_B10_Rtb_L = module.exports.XF_B10_Rtb_L = 552;
var XF_B10_Rtb_C = module.exports.XF_B10_Rtb_C = 553;
var XF_B10_Rtb_R = module.exports.XF_B10_Rtb_R = 554;
var XF_B10_RtB_L = module.exports.XF_B10_RtB_L = 555;
var XF_B10_RtB_C = module.exports.XF_B10_RtB_C = 556;
var XF_B10_RtB_R = module.exports.XF_B10_RtB_R = 5.5;
var XF_B10_RT_L = module.exports.XF_B10_RT_L = 558;
var XF_B10_RT_C = module.exports.XF_B10_RT_C = 559;
var XF_B10_RT_R = module.exports.XF_B10_RT_R = 560;
var XF_B10_RTb_L = module.exports.XF_B10_RTb_L = 561;
var XF_B10_RTb_C = module.exports.XF_B10_RTb_C = 562;
var XF_B10_RTb_R = module.exports.XF_B10_RTb_R = 563;
var XF_B10_RTB_L = module.exports.XF_B10_RTB_L = 564;
var XF_B10_RTB_C = module.exports.XF_B10_RTB_C = 565;
var XF_B10_RTB_R = module.exports.XF_B10_RTB_R = 566;
var XF_B10_l_L = module.exports.XF_B10_l_L = 5.5;
var XF_B10_l_C = module.exports.XF_B10_l_C = 568;
var XF_B10_l_R = module.exports.XF_B10_l_R = 569;
var XF_B10_lb_L = module.exports.XF_B10_lb_L = 570;
var XF_B10_lb_C = module.exports.XF_B10_lb_C = 571;
var XF_B10_lb_R = module.exports.XF_B10_lb_R = 572;
var XF_B10_lB_L = module.exports.XF_B10_lB_L = 573;
var XF_B10_lB_C = module.exports.XF_B10_lB_C = 574;
var XF_B10_lB_R = module.exports.XF_B10_lB_R = 575;
var XF_B10_lt_L = module.exports.XF_B10_lt_L = 576;
var XF_B10_lt_C = module.exports.XF_B10_lt_C = 5.5;
var XF_B10_lt_R = module.exports.XF_B10_lt_R = 578;
var XF_B10_ltb_L = module.exports.XF_B10_ltb_L = 579;
var XF_B10_ltb_C = module.exports.XF_B10_ltb_C = 580;
var XF_B10_ltb_R = module.exports.XF_B10_ltb_R = 581;
var XF_B10_ltB_L = module.exports.XF_B10_ltB_L = 582;
var XF_B10_ltB_C = module.exports.XF_B10_ltB_C = 583;
var XF_B10_ltB_R = module.exports.XF_B10_ltB_R = 584;
var XF_B10_lT_L = module.exports.XF_B10_lT_L = 585;
var XF_B10_lT_C = module.exports.XF_B10_lT_C = 586;
var XF_B10_lT_R = module.exports.XF_B10_lT_R = 5.5;
var XF_B10_lTb_L = module.exports.XF_B10_lTb_L = 588;
var XF_B10_lTb_C = module.exports.XF_B10_lTb_C = 589;
var XF_B10_lTb_R = module.exports.XF_B10_lTb_R = 590;
var XF_B10_lTB_L = module.exports.XF_B10_lTB_L = 591;
var XF_B10_lTB_C = module.exports.XF_B10_lTB_C = 592;
var XF_B10_lTB_R = module.exports.XF_B10_lTB_R = 593;
var XF_B10_lr_L = module.exports.XF_B10_lr_L = 594;
var XF_B10_lr_C = module.exports.XF_B10_lr_C = 595;
var XF_B10_lr_R = module.exports.XF_B10_lr_R = 596;
var XF_B10_lrb_L = module.exports.XF_B10_lrb_L = 5.5;
var XF_B10_lrb_C = module.exports.XF_B10_lrb_C = 598;
var XF_B10_lrb_R = module.exports.XF_B10_lrb_R = 599;
var XF_B10_lrB_L = module.exports.XF_B10_lrB_L = 600;
var XF_B10_lrB_C = module.exports.XF_B10_lrB_C = 601;
var XF_B10_lrB_R = module.exports.XF_B10_lrB_R = 602;
var XF_B10_lrt_L = module.exports.XF_B10_lrt_L = 603;
var XF_B10_lrt_C = module.exports.XF_B10_lrt_C = 604;
var XF_B10_lrt_R = module.exports.XF_B10_lrt_R = 605;
var XF_B10_lrtb_L = module.exports.XF_B10_lrtb_L = 606;
var XF_B10_lrtb_C = module.exports.XF_B10_lrtb_C = 607;
var XF_B10_lrtb_R = module.exports.XF_B10_lrtb_R = 608;
var XF_B10_lrtB_L = module.exports.XF_B10_lrtB_L = 609;
var XF_B10_lrtB_C = module.exports.XF_B10_lrtB_C = 610;
var XF_B10_lrtB_R = module.exports.XF_B10_lrtB_R = 611;
var XF_B10_lrT_L = module.exports.XF_B10_lrT_L = 612;
var XF_B10_lrT_C = module.exports.XF_B10_lrT_C = 613;
var XF_B10_lrT_R = module.exports.XF_B10_lrT_R = 614;
var XF_B10_lrTb_L = module.exports.XF_B10_lrTb_L = 615;
var XF_B10_lrTb_C = module.exports.XF_B10_lrTb_C = 616;
var XF_B10_lrTb_R = module.exports.XF_B10_lrTb_R = 617;
var XF_B10_lrTB_L = module.exports.XF_B10_lrTB_L = 618;
var XF_B10_lrTB_C = module.exports.XF_B10_lrTB_C = 619;
var XF_B10_lrTB_R = module.exports.XF_B10_lrTB_R = 620;
var XF_B10_lR_L = module.exports.XF_B10_lR_L = 621;
var XF_B10_lR_C = module.exports.XF_B10_lR_C = 622;
var XF_B10_lR_R = module.exports.XF_B10_lR_R = 623;
var XF_B10_lRb_L = module.exports.XF_B10_lRb_L = 624;
var XF_B10_lRb_C = module.exports.XF_B10_lRb_C = 625;
var XF_B10_lRb_R = module.exports.XF_B10_lRb_R = 626;
var XF_B10_lRB_L = module.exports.XF_B10_lRB_L = 627;
var XF_B10_lRB_C = module.exports.XF_B10_lRB_C = 628;
var XF_B10_lRB_R = module.exports.XF_B10_lRB_R = 629;
var XF_B10_lRt_L = module.exports.XF_B10_lRt_L = 630;
var XF_B10_lRt_C = module.exports.XF_B10_lRt_C = 631;
var XF_B10_lRt_R = module.exports.XF_B10_lRt_R = 632;
var XF_B10_lRtb_L = module.exports.XF_B10_lRtb_L = 633;
var XF_B10_lRtb_C = module.exports.XF_B10_lRtb_C = 634;
var XF_B10_lRtb_R = module.exports.XF_B10_lRtb_R = 635;
var XF_B10_lRtB_L = module.exports.XF_B10_lRtB_L = 636;
var XF_B10_lRtB_C = module.exports.XF_B10_lRtB_C = 637;
var XF_B10_lRtB_R = module.exports.XF_B10_lRtB_R = 638;
var XF_B10_lRT_L = module.exports.XF_B10_lRT_L = 639;
var XF_B10_lRT_C = module.exports.XF_B10_lRT_C = 640;
var XF_B10_lRT_R = module.exports.XF_B10_lRT_R = 641;
var XF_B10_lRTb_L = module.exports.XF_B10_lRTb_L = 642;
var XF_B10_lRTb_C = module.exports.XF_B10_lRTb_C = 643;
var XF_B10_lRTb_R = module.exports.XF_B10_lRTb_R = 644;
var XF_B10_lRTB_L = module.exports.XF_B10_lRTB_L = 645;
var XF_B10_lRTB_C = module.exports.XF_B10_lRTB_C = 646;
var XF_B10_lRTB_R = module.exports.XF_B10_lRTB_R = 647;
var XF_B10_L_L = module.exports.XF_B10_L_L = 648;
var XF_B10_L_C = module.exports.XF_B10_L_C = 649;
var XF_B10_L_R = module.exports.XF_B10_L_R = 650;
var XF_B10_Lb_L = module.exports.XF_B10_Lb_L = 651;
var XF_B10_Lb_C = module.exports.XF_B10_Lb_C = 652;
var XF_B10_Lb_R = module.exports.XF_B10_Lb_R = 653;
var XF_B10_LB_L = module.exports.XF_B10_LB_L = 654;
var XF_B10_LB_C = module.exports.XF_B10_LB_C = 655;
var XF_B10_LB_R = module.exports.XF_B10_LB_R = 656;
var XF_B10_Lt_L = module.exports.XF_B10_Lt_L = 657;
var XF_B10_Lt_C = module.exports.XF_B10_Lt_C = 658;
var XF_B10_Lt_R = module.exports.XF_B10_Lt_R = 659;
var XF_B10_Ltb_L = module.exports.XF_B10_Ltb_L = 660;
var XF_B10_Ltb_C = module.exports.XF_B10_Ltb_C = 661;
var XF_B10_Ltb_R = module.exports.XF_B10_Ltb_R = 662;
var XF_B10_LtB_L = module.exports.XF_B10_LtB_L = 663;
var XF_B10_LtB_C = module.exports.XF_B10_LtB_C = 664;
var XF_B10_LtB_R = module.exports.XF_B10_LtB_R = 665;
var XF_B10_LT_L = module.exports.XF_B10_LT_L = 666;
var XF_B10_LT_C = module.exports.XF_B10_LT_C = 667;
var XF_B10_LT_R = module.exports.XF_B10_LT_R = 668;
var XF_B10_LTb_L = module.exports.XF_B10_LTb_L = 669;
var XF_B10_LTb_C = module.exports.XF_B10_LTb_C = 670;
var XF_B10_LTb_R = module.exports.XF_B10_LTb_R = 671;
var XF_B10_LTB_L = module.exports.XF_B10_LTB_L = 672;
var XF_B10_LTB_C = module.exports.XF_B10_LTB_C = 673;
var XF_B10_LTB_R = module.exports.XF_B10_LTB_R = 674;
var XF_B10_Lr_L = module.exports.XF_B10_Lr_L = 675;
var XF_B10_Lr_C = module.exports.XF_B10_Lr_C = 676;
var XF_B10_Lr_R = module.exports.XF_B10_Lr_R = 677;
var XF_B10_Lrb_L = module.exports.XF_B10_Lrb_L = 678;
var XF_B10_Lrb_C = module.exports.XF_B10_Lrb_C = 679;
var XF_B10_Lrb_R = module.exports.XF_B10_Lrb_R = 680;
var XF_B10_LrB_L = module.exports.XF_B10_LrB_L = 681;
var XF_B10_LrB_C = module.exports.XF_B10_LrB_C = 682;
var XF_B10_LrB_R = module.exports.XF_B10_LrB_R = 683;
var XF_B10_Lrt_L = module.exports.XF_B10_Lrt_L = 684;
var XF_B10_Lrt_C = module.exports.XF_B10_Lrt_C = 685;
var XF_B10_Lrt_R = module.exports.XF_B10_Lrt_R = 686;
var XF_B10_Lrtb_L = module.exports.XF_B10_Lrtb_L = 687;
var XF_B10_Lrtb_C = module.exports.XF_B10_Lrtb_C = 688;
var XF_B10_Lrtb_R = module.exports.XF_B10_Lrtb_R = 689;
var XF_B10_LrtB_L = module.exports.XF_B10_LrtB_L = 690;
var XF_B10_LrtB_C = module.exports.XF_B10_LrtB_C = 691;
var XF_B10_LrtB_R = module.exports.XF_B10_LrtB_R = 692;
var XF_B10_LrT_L = module.exports.XF_B10_LrT_L = 693;
var XF_B10_LrT_C = module.exports.XF_B10_LrT_C = 694;
var XF_B10_LrT_R = module.exports.XF_B10_LrT_R = 695;
var XF_B10_LrTb_L = module.exports.XF_B10_LrTb_L = 696;
var XF_B10_LrTb_C = module.exports.XF_B10_LrTb_C = 697;
var XF_B10_LrTb_R = module.exports.XF_B10_LrTb_R = 698;
var XF_B10_LrTB_L = module.exports.XF_B10_LrTB_L = 699;
var XF_B10_LrTB_C = module.exports.XF_B10_LrTB_C = 700;
var XF_B10_LrTB_R = module.exports.XF_B10_LrTB_R = 701;
var XF_B10_LR_L = module.exports.XF_B10_LR_L = 702;
var XF_B10_LR_C = module.exports.XF_B10_LR_C = 703;
var XF_B10_LR_R = module.exports.XF_B10_LR_R = 704;
var XF_B10_LRb_L = module.exports.XF_B10_LRb_L = 705;
var XF_B10_LRb_C = module.exports.XF_B10_LRb_C = 706;
var XF_B10_LRb_R = module.exports.XF_B10_LRb_R = 707;
var XF_B10_LRB_L = module.exports.XF_B10_LRB_L = 708;
var XF_B10_LRB_C = module.exports.XF_B10_LRB_C = 709;
var XF_B10_LRB_R = module.exports.XF_B10_LRB_R = 710;
var XF_B10_LRt_L = module.exports.XF_B10_LRt_L = 711;
var XF_B10_LRt_C = module.exports.XF_B10_LRt_C = 712;
var XF_B10_LRt_R = module.exports.XF_B10_LRt_R = 713;
var XF_B10_LRtb_L = module.exports.XF_B10_LRtb_L = 714;
var XF_B10_LRtb_C = module.exports.XF_B10_LRtb_C = 715;
var XF_B10_LRtb_R = module.exports.XF_B10_LRtb_R = 716;
var XF_B10_LRtB_L = module.exports.XF_B10_LRtB_L = 717;
var XF_B10_LRtB_C = module.exports.XF_B10_LRtB_C = 718;
var XF_B10_LRtB_R = module.exports.XF_B10_LRtB_R = 719;
var XF_B10_LRT_L = module.exports.XF_B10_LRT_L = 720;
var XF_B10_LRT_C = module.exports.XF_B10_LRT_C = 721;
var XF_B10_LRT_R = module.exports.XF_B10_LRT_R = 722;
var XF_B10_LRTb_L = module.exports.XF_B10_LRTb_L = 723;
var XF_B10_LRTb_C = module.exports.XF_B10_LRTb_C = 724;
var XF_B10_LRTb_R = module.exports.XF_B10_LRTb_R = 725;
var XF_B10_LRTB_L = module.exports.XF_B10_LRTB_L = 726;
var XF_B10_LRTB_C = module.exports.XF_B10_LRTB_C = 727;
var XF_B10_LRTB_R = module.exports.XF_B10_LRTB_R = 728;
var XF_B10_GRAY_L = module.exports.XF_B10_GRAY_L = 729;
var XF_B10_GRAY_C = module.exports.XF_B10_GRAY_C = 730;
var XF_B10_GRAY_R = module.exports.XF_B10_GRAY_R = 731;
var XF_B10_GRAY_b_L = module.exports.XF_B10_GRAY_b_L = 732;
var XF_B10_GRAY_b_C = module.exports.XF_B10_GRAY_b_C = 733;
var XF_B10_GRAY_b_R = module.exports.XF_B10_GRAY_b_R = 734;
var XF_B10_GRAY_B_L = module.exports.XF_B10_GRAY_B_L = 735;
var XF_B10_GRAY_B_C = module.exports.XF_B10_GRAY_B_C = 736;
var XF_B10_GRAY_B_R = module.exports.XF_B10_GRAY_B_R = 737;
var XF_B10_GRAY_t_L = module.exports.XF_B10_GRAY_t_L = 738;
var XF_B10_GRAY_t_C = module.exports.XF_B10_GRAY_t_C = 739;
var XF_B10_GRAY_t_R = module.exports.XF_B10_GRAY_t_R = 740;
var XF_B10_GRAY_tb_L = module.exports.XF_B10_GRAY_tb_L = 741;
var XF_B10_GRAY_tb_C = module.exports.XF_B10_GRAY_tb_C = 742;
var XF_B10_GRAY_tb_R = module.exports.XF_B10_GRAY_tb_R = 743;
var XF_B10_GRAY_tB_L = module.exports.XF_B10_GRAY_tB_L = 744;
var XF_B10_GRAY_tB_C = module.exports.XF_B10_GRAY_tB_C = 745;
var XF_B10_GRAY_tB_R = module.exports.XF_B10_GRAY_tB_R = 746;
var XF_B10_GRAY_T_L = module.exports.XF_B10_GRAY_T_L = 747;
var XF_B10_GRAY_T_C = module.exports.XF_B10_GRAY_T_C = 748;
var XF_B10_GRAY_T_R = module.exports.XF_B10_GRAY_T_R = 749;
var XF_B10_GRAY_Tb_L = module.exports.XF_B10_GRAY_Tb_L = 750;
var XF_B10_GRAY_Tb_C = module.exports.XF_B10_GRAY_Tb_C = 751;
var XF_B10_GRAY_Tb_R = module.exports.XF_B10_GRAY_Tb_R = 752;
var XF_B10_GRAY_TB_L = module.exports.XF_B10_GRAY_TB_L = 753;
var XF_B10_GRAY_TB_C = module.exports.XF_B10_GRAY_TB_C = 754;
var XF_B10_GRAY_TB_R = module.exports.XF_B10_GRAY_TB_R = 755;
var XF_B10_GRAY_r_L = module.exports.XF_B10_GRAY_r_L = 756;
var XF_B10_GRAY_r_C = module.exports.XF_B10_GRAY_r_C = 757;
var XF_B10_GRAY_r_R = module.exports.XF_B10_GRAY_r_R = 758;
var XF_B10_GRAY_rb_L = module.exports.XF_B10_GRAY_rb_L = 759;
var XF_B10_GRAY_rb_C = module.exports.XF_B10_GRAY_rb_C = 760;
var XF_B10_GRAY_rb_R = module.exports.XF_B10_GRAY_rb_R = 761;
var XF_B10_GRAY_rB_L = module.exports.XF_B10_GRAY_rB_L = 762;
var XF_B10_GRAY_rB_C = module.exports.XF_B10_GRAY_rB_C = 763;
var XF_B10_GRAY_rB_R = module.exports.XF_B10_GRAY_rB_R = 764;
var XF_B10_GRAY_rt_L = module.exports.XF_B10_GRAY_rt_L = 765;
var XF_B10_GRAY_rt_C = module.exports.XF_B10_GRAY_rt_C = 766;
var XF_B10_GRAY_rt_R = module.exports.XF_B10_GRAY_rt_R = 767;
var XF_B10_GRAY_rtb_L = module.exports.XF_B10_GRAY_rtb_L = 768;
var XF_B10_GRAY_rtb_C = module.exports.XF_B10_GRAY_rtb_C = 769;
var XF_B10_GRAY_rtb_R = module.exports.XF_B10_GRAY_rtb_R = 770;
var XF_B10_GRAY_rtB_L = module.exports.XF_B10_GRAY_rtB_L = 771;
var XF_B10_GRAY_rtB_C = module.exports.XF_B10_GRAY_rtB_C = 772;
var XF_B10_GRAY_rtB_R = module.exports.XF_B10_GRAY_rtB_R = 773;
var XF_B10_GRAY_rT_L = module.exports.XF_B10_GRAY_rT_L = 774;
var XF_B10_GRAY_rT_C = module.exports.XF_B10_GRAY_rT_C = 775;
var XF_B10_GRAY_rT_R = module.exports.XF_B10_GRAY_rT_R = 776;
var XF_B10_GRAY_rTb_L = module.exports.XF_B10_GRAY_rTb_L = 777;
var XF_B10_GRAY_rTb_C = module.exports.XF_B10_GRAY_rTb_C = 778;
var XF_B10_GRAY_rTb_R = module.exports.XF_B10_GRAY_rTb_R = 779;
var XF_B10_GRAY_rTB_L = module.exports.XF_B10_GRAY_rTB_L = 780;
var XF_B10_GRAY_rTB_C = module.exports.XF_B10_GRAY_rTB_C = 781;
var XF_B10_GRAY_rTB_R = module.exports.XF_B10_GRAY_rTB_R = 782;
var XF_B10_GRAY_R_L = module.exports.XF_B10_GRAY_R_L = 783;
var XF_B10_GRAY_R_C = module.exports.XF_B10_GRAY_R_C = 784;
var XF_B10_GRAY_R_R = module.exports.XF_B10_GRAY_R_R = 785;
var XF_B10_GRAY_Rb_L = module.exports.XF_B10_GRAY_Rb_L = 786;
var XF_B10_GRAY_Rb_C = module.exports.XF_B10_GRAY_Rb_C = 787;
var XF_B10_GRAY_Rb_R = module.exports.XF_B10_GRAY_Rb_R = 788;
var XF_B10_GRAY_RB_L = module.exports.XF_B10_GRAY_RB_L = 789;
var XF_B10_GRAY_RB_C = module.exports.XF_B10_GRAY_RB_C = 790;
var XF_B10_GRAY_RB_R = module.exports.XF_B10_GRAY_RB_R = 791;
var XF_B10_GRAY_Rt_L = module.exports.XF_B10_GRAY_Rt_L = 792;
var XF_B10_GRAY_Rt_C = module.exports.XF_B10_GRAY_Rt_C = 793;
var XF_B10_GRAY_Rt_R = module.exports.XF_B10_GRAY_Rt_R = 794;
var XF_B10_GRAY_Rtb_L = module.exports.XF_B10_GRAY_Rtb_L = 795;
var XF_B10_GRAY_Rtb_C = module.exports.XF_B10_GRAY_Rtb_C = 796;
var XF_B10_GRAY_Rtb_R = module.exports.XF_B10_GRAY_Rtb_R = 797;
var XF_B10_GRAY_RtB_L = module.exports.XF_B10_GRAY_RtB_L = 798;
var XF_B10_GRAY_RtB_C = module.exports.XF_B10_GRAY_RtB_C = 799;
var XF_B10_GRAY_RtB_R = module.exports.XF_B10_GRAY_RtB_R = 800;
var XF_B10_GRAY_RT_L = module.exports.XF_B10_GRAY_RT_L = 801;
var XF_B10_GRAY_RT_C = module.exports.XF_B10_GRAY_RT_C = 802;
var XF_B10_GRAY_RT_R = module.exports.XF_B10_GRAY_RT_R = 803;
var XF_B10_GRAY_RTb_L = module.exports.XF_B10_GRAY_RTb_L = 804;
var XF_B10_GRAY_RTb_C = module.exports.XF_B10_GRAY_RTb_C = 805;
var XF_B10_GRAY_RTb_R = module.exports.XF_B10_GRAY_RTb_R = 806;
var XF_B10_GRAY_RTB_L = module.exports.XF_B10_GRAY_RTB_L = 807;
var XF_B10_GRAY_RTB_C = module.exports.XF_B10_GRAY_RTB_C = 808;
var XF_B10_GRAY_RTB_R = module.exports.XF_B10_GRAY_RTB_R = 809;
var XF_B10_GRAY_l_L = module.exports.XF_B10_GRAY_l_L = 810;
var XF_B10_GRAY_l_C = module.exports.XF_B10_GRAY_l_C = 811;
var XF_B10_GRAY_l_R = module.exports.XF_B10_GRAY_l_R = 812;
var XF_B10_GRAY_lb_L = module.exports.XF_B10_GRAY_lb_L = 813;
var XF_B10_GRAY_lb_C = module.exports.XF_B10_GRAY_lb_C = 814;
var XF_B10_GRAY_lb_R = module.exports.XF_B10_GRAY_lb_R = 815;
var XF_B10_GRAY_lB_L = module.exports.XF_B10_GRAY_lB_L = 816;
var XF_B10_GRAY_lB_C = module.exports.XF_B10_GRAY_lB_C = 817;
var XF_B10_GRAY_lB_R = module.exports.XF_B10_GRAY_lB_R = 818;
var XF_B10_GRAY_lt_L = module.exports.XF_B10_GRAY_lt_L = 819;
var XF_B10_GRAY_lt_C = module.exports.XF_B10_GRAY_lt_C = 820;
var XF_B10_GRAY_lt_R = module.exports.XF_B10_GRAY_lt_R = 821;
var XF_B10_GRAY_ltb_L = module.exports.XF_B10_GRAY_ltb_L = 822;
var XF_B10_GRAY_ltb_C = module.exports.XF_B10_GRAY_ltb_C = 823;
var XF_B10_GRAY_ltb_R = module.exports.XF_B10_GRAY_ltb_R = 824;
var XF_B10_GRAY_ltB_L = module.exports.XF_B10_GRAY_ltB_L = 825;
var XF_B10_GRAY_ltB_C = module.exports.XF_B10_GRAY_ltB_C = 826;
var XF_B10_GRAY_ltB_R = module.exports.XF_B10_GRAY_ltB_R = 827;
var XF_B10_GRAY_lT_L = module.exports.XF_B10_GRAY_lT_L = 828;
var XF_B10_GRAY_lT_C = module.exports.XF_B10_GRAY_lT_C = 829;
var XF_B10_GRAY_lT_R = module.exports.XF_B10_GRAY_lT_R = 830;
var XF_B10_GRAY_lTb_L = module.exports.XF_B10_GRAY_lTb_L = 831;
var XF_B10_GRAY_lTb_C = module.exports.XF_B10_GRAY_lTb_C = 832;
var XF_B10_GRAY_lTb_R = module.exports.XF_B10_GRAY_lTb_R = 833;
var XF_B10_GRAY_lTB_L = module.exports.XF_B10_GRAY_lTB_L = 834;
var XF_B10_GRAY_lTB_C = module.exports.XF_B10_GRAY_lTB_C = 835;
var XF_B10_GRAY_lTB_R = module.exports.XF_B10_GRAY_lTB_R = 836;
var XF_B10_GRAY_lr_L = module.exports.XF_B10_GRAY_lr_L = 837;
var XF_B10_GRAY_lr_C = module.exports.XF_B10_GRAY_lr_C = 838;
var XF_B10_GRAY_lr_R = module.exports.XF_B10_GRAY_lr_R = 839;
var XF_B10_GRAY_lrb_L = module.exports.XF_B10_GRAY_lrb_L = 840;
var XF_B10_GRAY_lrb_C = module.exports.XF_B10_GRAY_lrb_C = 841;
var XF_B10_GRAY_lrb_R = module.exports.XF_B10_GRAY_lrb_R = 842;
var XF_B10_GRAY_lrB_L = module.exports.XF_B10_GRAY_lrB_L = 843;
var XF_B10_GRAY_lrB_C = module.exports.XF_B10_GRAY_lrB_C = 844;
var XF_B10_GRAY_lrB_R = module.exports.XF_B10_GRAY_lrB_R = 845;
var XF_B10_GRAY_lrt_L = module.exports.XF_B10_GRAY_lrt_L = 846;
var XF_B10_GRAY_lrt_C = module.exports.XF_B10_GRAY_lrt_C = 847;
var XF_B10_GRAY_lrt_R = module.exports.XF_B10_GRAY_lrt_R = 848;
var XF_B10_GRAY_lrtb_L = module.exports.XF_B10_GRAY_lrtb_L = 849;
var XF_B10_GRAY_lrtb_C = module.exports.XF_B10_GRAY_lrtb_C = 850;
var XF_B10_GRAY_lrtb_R = module.exports.XF_B10_GRAY_lrtb_R = 851;
var XF_B10_GRAY_lrtB_L = module.exports.XF_B10_GRAY_lrtB_L = 852;
var XF_B10_GRAY_lrtB_C = module.exports.XF_B10_GRAY_lrtB_C = 853;
var XF_B10_GRAY_lrtB_R = module.exports.XF_B10_GRAY_lrtB_R = 854;
var XF_B10_GRAY_lrT_L = module.exports.XF_B10_GRAY_lrT_L = 855;
var XF_B10_GRAY_lrT_C = module.exports.XF_B10_GRAY_lrT_C = 856;
var XF_B10_GRAY_lrT_R = module.exports.XF_B10_GRAY_lrT_R = 857;
var XF_B10_GRAY_lrTb_L = module.exports.XF_B10_GRAY_lrTb_L = 858;
var XF_B10_GRAY_lrTb_C = module.exports.XF_B10_GRAY_lrTb_C = 859;
var XF_B10_GRAY_lrTb_R = module.exports.XF_B10_GRAY_lrTb_R = 860;
var XF_B10_GRAY_lrTB_L = module.exports.XF_B10_GRAY_lrTB_L = 861;
var XF_B10_GRAY_lrTB_C = module.exports.XF_B10_GRAY_lrTB_C = 862;
var XF_B10_GRAY_lrTB_R = module.exports.XF_B10_GRAY_lrTB_R = 863;
var XF_B10_GRAY_lR_L = module.exports.XF_B10_GRAY_lR_L = 864;
var XF_B10_GRAY_lR_C = module.exports.XF_B10_GRAY_lR_C = 865;
var XF_B10_GRAY_lR_R = module.exports.XF_B10_GRAY_lR_R = 866;
var XF_B10_GRAY_lRb_L = module.exports.XF_B10_GRAY_lRb_L = 867;
var XF_B10_GRAY_lRb_C = module.exports.XF_B10_GRAY_lRb_C = 868;
var XF_B10_GRAY_lRb_R = module.exports.XF_B10_GRAY_lRb_R = 869;
var XF_B10_GRAY_lRB_L = module.exports.XF_B10_GRAY_lRB_L = 870;
var XF_B10_GRAY_lRB_C = module.exports.XF_B10_GRAY_lRB_C = 871;
var XF_B10_GRAY_lRB_R = module.exports.XF_B10_GRAY_lRB_R = 872;
var XF_B10_GRAY_lRt_L = module.exports.XF_B10_GRAY_lRt_L = 873;
var XF_B10_GRAY_lRt_C = module.exports.XF_B10_GRAY_lRt_C = 874;
var XF_B10_GRAY_lRt_R = module.exports.XF_B10_GRAY_lRt_R = 875;
var XF_B10_GRAY_lRtb_L = module.exports.XF_B10_GRAY_lRtb_L = 876;
var XF_B10_GRAY_lRtb_C = module.exports.XF_B10_GRAY_lRtb_C = 877;
var XF_B10_GRAY_lRtb_R = module.exports.XF_B10_GRAY_lRtb_R = 878;
var XF_B10_GRAY_lRtB_L = module.exports.XF_B10_GRAY_lRtB_L = 879;
var XF_B10_GRAY_lRtB_C = module.exports.XF_B10_GRAY_lRtB_C = 880;
var XF_B10_GRAY_lRtB_R = module.exports.XF_B10_GRAY_lRtB_R = 881;
var XF_B10_GRAY_lRT_L = module.exports.XF_B10_GRAY_lRT_L = 882;
var XF_B10_GRAY_lRT_C = module.exports.XF_B10_GRAY_lRT_C = 883;
var XF_B10_GRAY_lRT_R = module.exports.XF_B10_GRAY_lRT_R = 884;
var XF_B10_GRAY_lRTb_L = module.exports.XF_B10_GRAY_lRTb_L = 885;
var XF_B10_GRAY_lRTb_C = module.exports.XF_B10_GRAY_lRTb_C = 886;
var XF_B10_GRAY_lRTb_R = module.exports.XF_B10_GRAY_lRTb_R = 887;
var XF_B10_GRAY_lRTB_L = module.exports.XF_B10_GRAY_lRTB_L = 888;
var XF_B10_GRAY_lRTB_C = module.exports.XF_B10_GRAY_lRTB_C = 889;
var XF_B10_GRAY_lRTB_R = module.exports.XF_B10_GRAY_lRTB_R = 890;
var XF_B10_GRAY_L_L = module.exports.XF_B10_GRAY_L_L = 891;
var XF_B10_GRAY_L_C = module.exports.XF_B10_GRAY_L_C = 892;
var XF_B10_GRAY_L_R = module.exports.XF_B10_GRAY_L_R = 893;
var XF_B10_GRAY_Lb_L = module.exports.XF_B10_GRAY_Lb_L = 894;
var XF_B10_GRAY_Lb_C = module.exports.XF_B10_GRAY_Lb_C = 895;
var XF_B10_GRAY_Lb_R = module.exports.XF_B10_GRAY_Lb_R = 896;
var XF_B10_GRAY_LB_L = module.exports.XF_B10_GRAY_LB_L = 897;
var XF_B10_GRAY_LB_C = module.exports.XF_B10_GRAY_LB_C = 898;
var XF_B10_GRAY_LB_R = module.exports.XF_B10_GRAY_LB_R = 899;
var XF_B10_GRAY_Lt_L = module.exports.XF_B10_GRAY_Lt_L = 900;
var XF_B10_GRAY_Lt_C = module.exports.XF_B10_GRAY_Lt_C = 901;
var XF_B10_GRAY_Lt_R = module.exports.XF_B10_GRAY_Lt_R = 902;
var XF_B10_GRAY_Ltb_L = module.exports.XF_B10_GRAY_Ltb_L = 903;
var XF_B10_GRAY_Ltb_C = module.exports.XF_B10_GRAY_Ltb_C = 904;
var XF_B10_GRAY_Ltb_R = module.exports.XF_B10_GRAY_Ltb_R = 905;
var XF_B10_GRAY_LtB_L = module.exports.XF_B10_GRAY_LtB_L = 906;
var XF_B10_GRAY_LtB_C = module.exports.XF_B10_GRAY_LtB_C = 907;
var XF_B10_GRAY_LtB_R = module.exports.XF_B10_GRAY_LtB_R = 908;
var XF_B10_GRAY_LT_L = module.exports.XF_B10_GRAY_LT_L = 909;
var XF_B10_GRAY_LT_C = module.exports.XF_B10_GRAY_LT_C = 910;
var XF_B10_GRAY_LT_R = module.exports.XF_B10_GRAY_LT_R = 911;
var XF_B10_GRAY_LTb_L = module.exports.XF_B10_GRAY_LTb_L = 912;
var XF_B10_GRAY_LTb_C = module.exports.XF_B10_GRAY_LTb_C = 913;
var XF_B10_GRAY_LTb_R = module.exports.XF_B10_GRAY_LTb_R = 914;
var XF_B10_GRAY_LTB_L = module.exports.XF_B10_GRAY_LTB_L = 915;
var XF_B10_GRAY_LTB_C = module.exports.XF_B10_GRAY_LTB_C = 916;
var XF_B10_GRAY_LTB_R = module.exports.XF_B10_GRAY_LTB_R = 917;
var XF_B10_GRAY_Lr_L = module.exports.XF_B10_GRAY_Lr_L = 918;
var XF_B10_GRAY_Lr_C = module.exports.XF_B10_GRAY_Lr_C = 919;
var XF_B10_GRAY_Lr_R = module.exports.XF_B10_GRAY_Lr_R = 920;
var XF_B10_GRAY_Lrb_L = module.exports.XF_B10_GRAY_Lrb_L = 921;
var XF_B10_GRAY_Lrb_C = module.exports.XF_B10_GRAY_Lrb_C = 922;
var XF_B10_GRAY_Lrb_R = module.exports.XF_B10_GRAY_Lrb_R = 923;
var XF_B10_GRAY_LrB_L = module.exports.XF_B10_GRAY_LrB_L = 924;
var XF_B10_GRAY_LrB_C = module.exports.XF_B10_GRAY_LrB_C = 925;
var XF_B10_GRAY_LrB_R = module.exports.XF_B10_GRAY_LrB_R = 926;
var XF_B10_GRAY_Lrt_L = module.exports.XF_B10_GRAY_Lrt_L = 927;
var XF_B10_GRAY_Lrt_C = module.exports.XF_B10_GRAY_Lrt_C = 928;
var XF_B10_GRAY_Lrt_R = module.exports.XF_B10_GRAY_Lrt_R = 929;
var XF_B10_GRAY_Lrtb_L = module.exports.XF_B10_GRAY_Lrtb_L = 930;
var XF_B10_GRAY_Lrtb_C = module.exports.XF_B10_GRAY_Lrtb_C = 931;
var XF_B10_GRAY_Lrtb_R = module.exports.XF_B10_GRAY_Lrtb_R = 932;
var XF_B10_GRAY_LrtB_L = module.exports.XF_B10_GRAY_LrtB_L = 933;
var XF_B10_GRAY_LrtB_C = module.exports.XF_B10_GRAY_LrtB_C = 934;
var XF_B10_GRAY_LrtB_R = module.exports.XF_B10_GRAY_LrtB_R = 935;
var XF_B10_GRAY_LrT_L = module.exports.XF_B10_GRAY_LrT_L = 936;
var XF_B10_GRAY_LrT_C = module.exports.XF_B10_GRAY_LrT_C = 937;
var XF_B10_GRAY_LrT_R = module.exports.XF_B10_GRAY_LrT_R = 938;
var XF_B10_GRAY_LrTb_L = module.exports.XF_B10_GRAY_LrTb_L = 939;
var XF_B10_GRAY_LrTb_C = module.exports.XF_B10_GRAY_LrTb_C = 940;
var XF_B10_GRAY_LrTb_R = module.exports.XF_B10_GRAY_LrTb_R = 941;
var XF_B10_GRAY_LrTB_L = module.exports.XF_B10_GRAY_LrTB_L = 942;
var XF_B10_GRAY_LrTB_C = module.exports.XF_B10_GRAY_LrTB_C = 943;
var XF_B10_GRAY_LrTB_R = module.exports.XF_B10_GRAY_LrTB_R = 944;
var XF_B10_GRAY_LR_L = module.exports.XF_B10_GRAY_LR_L = 945;
var XF_B10_GRAY_LR_C = module.exports.XF_B10_GRAY_LR_C = 946;
var XF_B10_GRAY_LR_R = module.exports.XF_B10_GRAY_LR_R = 947;
var XF_B10_GRAY_LRb_L = module.exports.XF_B10_GRAY_LRb_L = 948;
var XF_B10_GRAY_LRb_C = module.exports.XF_B10_GRAY_LRb_C = 949;
var XF_B10_GRAY_LRb_R = module.exports.XF_B10_GRAY_LRb_R = 950;
var XF_B10_GRAY_LRB_L = module.exports.XF_B10_GRAY_LRB_L = 951;
var XF_B10_GRAY_LRB_C = module.exports.XF_B10_GRAY_LRB_C = 952;
var XF_B10_GRAY_LRB_R = module.exports.XF_B10_GRAY_LRB_R = 953;
var XF_B10_GRAY_LRt_L = module.exports.XF_B10_GRAY_LRt_L = 954;
var XF_B10_GRAY_LRt_C = module.exports.XF_B10_GRAY_LRt_C = 955;
var XF_B10_GRAY_LRt_R = module.exports.XF_B10_GRAY_LRt_R = 956;
var XF_B10_GRAY_LRtb_L = module.exports.XF_B10_GRAY_LRtb_L = 957;
var XF_B10_GRAY_LRtb_C = module.exports.XF_B10_GRAY_LRtb_C = 958;
var XF_B10_GRAY_LRtb_R = module.exports.XF_B10_GRAY_LRtb_R = 959;
var XF_B10_GRAY_LRtB_L = module.exports.XF_B10_GRAY_LRtB_L = 960;
var XF_B10_GRAY_LRtB_C = module.exports.XF_B10_GRAY_LRtB_C = 961;
var XF_B10_GRAY_LRtB_R = module.exports.XF_B10_GRAY_LRtB_R = 962;
var XF_B10_GRAY_LRT_L = module.exports.XF_B10_GRAY_LRT_L = 963;
var XF_B10_GRAY_LRT_C = module.exports.XF_B10_GRAY_LRT_C = 964;
var XF_B10_GRAY_LRT_R = module.exports.XF_B10_GRAY_LRT_R = 965;
var XF_B10_GRAY_LRTb_L = module.exports.XF_B10_GRAY_LRTb_L = 966;
var XF_B10_GRAY_LRTb_C = module.exports.XF_B10_GRAY_LRTb_C = 967;
var XF_B10_GRAY_LRTb_R = module.exports.XF_B10_GRAY_LRTb_R = 968;
var XF_B10_GRAY_LRTB_L = module.exports.XF_B10_GRAY_LRTB_L = 969;
var XF_B10_GRAY_LRTB_C = module.exports.XF_B10_GRAY_LRTB_C = 970;
var XF_B10_GRAY_LRTB_R = module.exports.XF_B10_GRAY_LRTB_R = 971;
var XF_8_L = module.exports.XF_8_L = 972;
var XF_8_C = module.exports.XF_8_C = 973;
var XF_8_R = module.exports.XF_8_R = 974;
var XF_8_b_L = module.exports.XF_8_b_L = 975;
var XF_8_b_C = module.exports.XF_8_b_C = 976;
var XF_8_b_R = module.exports.XF_8_b_R = 977;
var XF_8_B_L = module.exports.XF_8_B_L = 978;
var XF_8_B_C = module.exports.XF_8_B_C = 979;
var XF_8_B_R = module.exports.XF_8_B_R = 980;
var XF_8_t_L = module.exports.XF_8_t_L = 981;
var XF_8_t_C = module.exports.XF_8_t_C = 982;
var XF_8_t_R = module.exports.XF_8_t_R = 983;
var XF_8_tb_L = module.exports.XF_8_tb_L = 984;
var XF_8_tb_C = module.exports.XF_8_tb_C = 985;
var XF_8_tb_R = module.exports.XF_8_tb_R = 986;
var XF_8_tB_L = module.exports.XF_8_tB_L = 987;
var XF_8_tB_C = module.exports.XF_8_tB_C = 988;
var XF_8_tB_R = module.exports.XF_8_tB_R = 989;
var XF_8_T_L = module.exports.XF_8_T_L = 990;
var XF_8_T_C = module.exports.XF_8_T_C = 991;
var XF_8_T_R = module.exports.XF_8_T_R = 992;
var XF_8_Tb_L = module.exports.XF_8_Tb_L = 993;
var XF_8_Tb_C = module.exports.XF_8_Tb_C = 994;
var XF_8_Tb_R = module.exports.XF_8_Tb_R = 995;
var XF_8_TB_L = module.exports.XF_8_TB_L = 996;
var XF_8_TB_C = module.exports.XF_8_TB_C = 997;
var XF_8_TB_R = module.exports.XF_8_TB_R = 998;
var XF_8_r_L = module.exports.XF_8_r_L = 999;
var XF_8_r_C = module.exports.XF_8_r_C = 1000;
var XF_8_r_R = module.exports.XF_8_r_R = 1001;
var XF_8_rb_L = module.exports.XF_8_rb_L = 1002;
var XF_8_rb_C = module.exports.XF_8_rb_C = 1003;
var XF_8_rb_R = module.exports.XF_8_rb_R = 1004;
var XF_8_rB_L = module.exports.XF_8_rB_L = 1005;
var XF_8_rB_C = module.exports.XF_8_rB_C = 1006;
var XF_8_rB_R = module.exports.XF_8_rB_R = 1007;
var XF_8_rt_L = module.exports.XF_8_rt_L = 1008;
var XF_8_rt_C = module.exports.XF_8_rt_C = 1009;
var XF_8_rt_R = module.exports.XF_8_rt_R = 1010;
var XF_8_rtb_L = module.exports.XF_8_rtb_L = 1011;
var XF_8_rtb_C = module.exports.XF_8_rtb_C = 1012;
var XF_8_rtb_R = module.exports.XF_8_rtb_R = 1013;
var XF_8_rtB_L = module.exports.XF_8_rtB_L = 1014;
var XF_8_rtB_C = module.exports.XF_8_rtB_C = 1015;
var XF_8_rtB_R = module.exports.XF_8_rtB_R = 1016;
var XF_8_rT_L = module.exports.XF_8_rT_L = 1017;
var XF_8_rT_C = module.exports.XF_8_rT_C = 1018;
var XF_8_rT_R = module.exports.XF_8_rT_R = 1019;
var XF_8_rTb_L = module.exports.XF_8_rTb_L = 1020;
var XF_8_rTb_C = module.exports.XF_8_rTb_C = 1021;
var XF_8_rTb_R = module.exports.XF_8_rTb_R = 1022;
var XF_8_rTB_L = module.exports.XF_8_rTB_L = 1023;
var XF_8_rTB_C = module.exports.XF_8_rTB_C = 1024;
var XF_8_rTB_R = module.exports.XF_8_rTB_R = 1025;
var XF_8_R_L = module.exports.XF_8_R_L = 1026;
var XF_8_R_C = module.exports.XF_8_R_C = 1027;
var XF_8_R_R = module.exports.XF_8_R_R = 1028;
var XF_8_Rb_L = module.exports.XF_8_Rb_L = 1029;
var XF_8_Rb_C = module.exports.XF_8_Rb_C = 1030;
var XF_8_Rb_R = module.exports.XF_8_Rb_R = 1031;
var XF_8_RB_L = module.exports.XF_8_RB_L = 1032;
var XF_8_RB_C = module.exports.XF_8_RB_C = 1033;
var XF_8_RB_R = module.exports.XF_8_RB_R = 1034;
var XF_8_Rt_L = module.exports.XF_8_Rt_L = 1035;
var XF_8_Rt_C = module.exports.XF_8_Rt_C = 1036;
var XF_8_Rt_R = module.exports.XF_8_Rt_R = 1037;
var XF_8_Rtb_L = module.exports.XF_8_Rtb_L = 1038;
var XF_8_Rtb_C = module.exports.XF_8_Rtb_C = 1039;
var XF_8_Rtb_R = module.exports.XF_8_Rtb_R = 1040;
var XF_8_RtB_L = module.exports.XF_8_RtB_L = 1041;
var XF_8_RtB_C = module.exports.XF_8_RtB_C = 1042;
var XF_8_RtB_R = module.exports.XF_8_RtB_R = 1043;
var XF_8_RT_L = module.exports.XF_8_RT_L = 1044;
var XF_8_RT_C = module.exports.XF_8_RT_C = 1045;
var XF_8_RT_R = module.exports.XF_8_RT_R = 1046;
var XF_8_RTb_L = module.exports.XF_8_RTb_L = 1047;
var XF_8_RTb_C = module.exports.XF_8_RTb_C = 1048;
var XF_8_RTb_R = module.exports.XF_8_RTb_R = 1049;
var XF_8_RTB_L = module.exports.XF_8_RTB_L = 1050;
var XF_8_RTB_C = module.exports.XF_8_RTB_C = 1051;
var XF_8_RTB_R = module.exports.XF_8_RTB_R = 1052;
var XF_8_l_L = module.exports.XF_8_l_L = 1053;
var XF_8_l_C = module.exports.XF_8_l_C = 1054;
var XF_8_l_R = module.exports.XF_8_l_R = 1055;
var XF_8_lb_L = module.exports.XF_8_lb_L = 1056;
var XF_8_lb_C = module.exports.XF_8_lb_C = 1057;
var XF_8_lb_R = module.exports.XF_8_lb_R = 1058;
var XF_8_lB_L = module.exports.XF_8_lB_L = 1059;
var XF_8_lB_C = module.exports.XF_8_lB_C = 1060;
var XF_8_lB_R = module.exports.XF_8_lB_R = 1061;
var XF_8_lt_L = module.exports.XF_8_lt_L = 1062;
var XF_8_lt_C = module.exports.XF_8_lt_C = 1063;
var XF_8_lt_R = module.exports.XF_8_lt_R = 1064;
var XF_8_ltb_L = module.exports.XF_8_ltb_L = 1065;
var XF_8_ltb_C = module.exports.XF_8_ltb_C = 1066;
var XF_8_ltb_R = module.exports.XF_8_ltb_R = 1067;
var XF_8_ltB_L = module.exports.XF_8_ltB_L = 1068;
var XF_8_ltB_C = module.exports.XF_8_ltB_C = 1069;
var XF_8_ltB_R = module.exports.XF_8_ltB_R = 1070;
var XF_8_lT_L = module.exports.XF_8_lT_L = 1071;
var XF_8_lT_C = module.exports.XF_8_lT_C = 1072;
var XF_8_lT_R = module.exports.XF_8_lT_R = 1073;
var XF_8_lTb_L = module.exports.XF_8_lTb_L = 1074;
var XF_8_lTb_C = module.exports.XF_8_lTb_C = 1075;
var XF_8_lTb_R = module.exports.XF_8_lTb_R = 1076;
var XF_8_lTB_L = module.exports.XF_8_lTB_L = 1077;
var XF_8_lTB_C = module.exports.XF_8_lTB_C = 1078;
var XF_8_lTB_R = module.exports.XF_8_lTB_R = 1079;
var XF_8_lr_L = module.exports.XF_8_lr_L = 1080;
var XF_8_lr_C = module.exports.XF_8_lr_C = 1081;
var XF_8_lr_R = module.exports.XF_8_lr_R = 1082;
var XF_8_lrb_L = module.exports.XF_8_lrb_L = 1083;
var XF_8_lrb_C = module.exports.XF_8_lrb_C = 1084;
var XF_8_lrb_R = module.exports.XF_8_lrb_R = 1085;
var XF_8_lrB_L = module.exports.XF_8_lrB_L = 1086;
var XF_8_lrB_C = module.exports.XF_8_lrB_C = 1087;
var XF_8_lrB_R = module.exports.XF_8_lrB_R = 1088;
var XF_8_lrt_L = module.exports.XF_8_lrt_L = 1089;
var XF_8_lrt_C = module.exports.XF_8_lrt_C = 1090;
var XF_8_lrt_R = module.exports.XF_8_lrt_R = 1091;
var XF_8_lrtb_L = module.exports.XF_8_lrtb_L = 1092;
var XF_8_lrtb_C = module.exports.XF_8_lrtb_C = 1093;
var XF_8_lrtb_R = module.exports.XF_8_lrtb_R = 1094;
var XF_8_lrtB_L = module.exports.XF_8_lrtB_L = 1095;
var XF_8_lrtB_C = module.exports.XF_8_lrtB_C = 1096;
var XF_8_lrtB_R = module.exports.XF_8_lrtB_R = 1097;
var XF_8_lrT_L = module.exports.XF_8_lrT_L = 1098;
var XF_8_lrT_C = module.exports.XF_8_lrT_C = 1099;
var XF_8_lrT_R = module.exports.XF_8_lrT_R = 1100;
var XF_8_lrTb_L = module.exports.XF_8_lrTb_L = 1101;
var XF_8_lrTb_C = module.exports.XF_8_lrTb_C = 1102;
var XF_8_lrTb_R = module.exports.XF_8_lrTb_R = 1103;
var XF_8_lrTB_L = module.exports.XF_8_lrTB_L = 1104;
var XF_8_lrTB_C = module.exports.XF_8_lrTB_C = 1105;
var XF_8_lrTB_R = module.exports.XF_8_lrTB_R = 1106;
var XF_8_lR_L = module.exports.XF_8_lR_L = 1107;
var XF_8_lR_C = module.exports.XF_8_lR_C = 1108;
var XF_8_lR_R = module.exports.XF_8_lR_R = 1109;
var XF_8_lRb_L = module.exports.XF_8_lRb_L = 1110;
var XF_8_lRb_C = module.exports.XF_8_lRb_C = 1111;
var XF_8_lRb_R = module.exports.XF_8_lRb_R = 1112;
var XF_8_lRB_L = module.exports.XF_8_lRB_L = 1113;
var XF_8_lRB_C = module.exports.XF_8_lRB_C = 1114;
var XF_8_lRB_R = module.exports.XF_8_lRB_R = 1115;
var XF_8_lRt_L = module.exports.XF_8_lRt_L = 1116;
var XF_8_lRt_C = module.exports.XF_8_lRt_C = 1117;
var XF_8_lRt_R = module.exports.XF_8_lRt_R = 1118;
var XF_8_lRtb_L = module.exports.XF_8_lRtb_L = 1119;
var XF_8_lRtb_C = module.exports.XF_8_lRtb_C = 1120;
var XF_8_lRtb_R = module.exports.XF_8_lRtb_R = 1121;
var XF_8_lRtB_L = module.exports.XF_8_lRtB_L = 1122;
var XF_8_lRtB_C = module.exports.XF_8_lRtB_C = 1123;
var XF_8_lRtB_R = module.exports.XF_8_lRtB_R = 1124;
var XF_8_lRT_L = module.exports.XF_8_lRT_L = 1125;
var XF_8_lRT_C = module.exports.XF_8_lRT_C = 1126;
var XF_8_lRT_R = module.exports.XF_8_lRT_R = 1127;
var XF_8_lRTb_L = module.exports.XF_8_lRTb_L = 1128;
var XF_8_lRTb_C = module.exports.XF_8_lRTb_C = 1129;
var XF_8_lRTb_R = module.exports.XF_8_lRTb_R = 1130;
var XF_8_lRTB_L = module.exports.XF_8_lRTB_L = 1131;
var XF_8_lRTB_C = module.exports.XF_8_lRTB_C = 1132;
var XF_8_lRTB_R = module.exports.XF_8_lRTB_R = 1133;
var XF_8_L_L = module.exports.XF_8_L_L = 1134;
var XF_8_L_C = module.exports.XF_8_L_C = 1135;
var XF_8_L_R = module.exports.XF_8_L_R = 1136;
var XF_8_Lb_L = module.exports.XF_8_Lb_L = 1137;
var XF_8_Lb_C = module.exports.XF_8_Lb_C = 1138;
var XF_8_Lb_R = module.exports.XF_8_Lb_R = 1139;
var XF_8_LB_L = module.exports.XF_8_LB_L = 1140;
var XF_8_LB_C = module.exports.XF_8_LB_C = 1141;
var XF_8_LB_R = module.exports.XF_8_LB_R = 1142;
var XF_8_Lt_L = module.exports.XF_8_Lt_L = 1143;
var XF_8_Lt_C = module.exports.XF_8_Lt_C = 1144;
var XF_8_Lt_R = module.exports.XF_8_Lt_R = 1145;
var XF_8_Ltb_L = module.exports.XF_8_Ltb_L = 1146;
var XF_8_Ltb_C = module.exports.XF_8_Ltb_C = 1147;
var XF_8_Ltb_R = module.exports.XF_8_Ltb_R = 1148;
var XF_8_LtB_L = module.exports.XF_8_LtB_L = 1149;
var XF_8_LtB_C = module.exports.XF_8_LtB_C = 1150;
var XF_8_LtB_R = module.exports.XF_8_LtB_R = 1151;
var XF_8_LT_L = module.exports.XF_8_LT_L = 1152;
var XF_8_LT_C = module.exports.XF_8_LT_C = 1153;
var XF_8_LT_R = module.exports.XF_8_LT_R = 1154;
var XF_8_LTb_L = module.exports.XF_8_LTb_L = 1155;
var XF_8_LTb_C = module.exports.XF_8_LTb_C = 1156;
var XF_8_LTb_R = module.exports.XF_8_LTb_R = 1157;
var XF_8_LTB_L = module.exports.XF_8_LTB_L = 1158;
var XF_8_LTB_C = module.exports.XF_8_LTB_C = 1159;
var XF_8_LTB_R = module.exports.XF_8_LTB_R = 1160;
var XF_8_Lr_L = module.exports.XF_8_Lr_L = 1161;
var XF_8_Lr_C = module.exports.XF_8_Lr_C = 1162;
var XF_8_Lr_R = module.exports.XF_8_Lr_R = 1163;
var XF_8_Lrb_L = module.exports.XF_8_Lrb_L = 1164;
var XF_8_Lrb_C = module.exports.XF_8_Lrb_C = 1165;
var XF_8_Lrb_R = module.exports.XF_8_Lrb_R = 1166;
var XF_8_LrB_L = module.exports.XF_8_LrB_L = 1167;
var XF_8_LrB_C = module.exports.XF_8_LrB_C = 1168;
var XF_8_LrB_R = module.exports.XF_8_LrB_R = 1169;
var XF_8_Lrt_L = module.exports.XF_8_Lrt_L = 1170;
var XF_8_Lrt_C = module.exports.XF_8_Lrt_C = 1171;
var XF_8_Lrt_R = module.exports.XF_8_Lrt_R = 1172;
var XF_8_Lrtb_L = module.exports.XF_8_Lrtb_L = 1173;
var XF_8_Lrtb_C = module.exports.XF_8_Lrtb_C = 1174;
var XF_8_Lrtb_R = module.exports.XF_8_Lrtb_R = 1175;
var XF_8_LrtB_L = module.exports.XF_8_LrtB_L = 1176;
var XF_8_LrtB_C = module.exports.XF_8_LrtB_C = 1177;
var XF_8_LrtB_R = module.exports.XF_8_LrtB_R = 1178;
var XF_8_LrT_L = module.exports.XF_8_LrT_L = 1179;
var XF_8_LrT_C = module.exports.XF_8_LrT_C = 1180;
var XF_8_LrT_R = module.exports.XF_8_LrT_R = 1181;
var XF_8_LrTb_L = module.exports.XF_8_LrTb_L = 1182;
var XF_8_LrTb_C = module.exports.XF_8_LrTb_C = 1183;
var XF_8_LrTb_R = module.exports.XF_8_LrTb_R = 1184;
var XF_8_LrTB_L = module.exports.XF_8_LrTB_L = 1185;
var XF_8_LrTB_C = module.exports.XF_8_LrTB_C = 1186;
var XF_8_LrTB_R = module.exports.XF_8_LrTB_R = 1187;
var XF_8_LR_L = module.exports.XF_8_LR_L = 1188;
var XF_8_LR_C = module.exports.XF_8_LR_C = 1189;
var XF_8_LR_R = module.exports.XF_8_LR_R = 1190;
var XF_8_LRb_L = module.exports.XF_8_LRb_L = 1191;
var XF_8_LRb_C = module.exports.XF_8_LRb_C = 1192;
var XF_8_LRb_R = module.exports.XF_8_LRb_R = 1193;
var XF_8_LRB_L = module.exports.XF_8_LRB_L = 1194;
var XF_8_LRB_C = module.exports.XF_8_LRB_C = 1195;
var XF_8_LRB_R = module.exports.XF_8_LRB_R = 1196;
var XF_8_LRt_L = module.exports.XF_8_LRt_L = 1197;
var XF_8_LRt_C = module.exports.XF_8_LRt_C = 1198;
var XF_8_LRt_R = module.exports.XF_8_LRt_R = 1199;
var XF_8_LRtb_L = module.exports.XF_8_LRtb_L = 1200;
var XF_8_LRtb_C = module.exports.XF_8_LRtb_C = 1201;
var XF_8_LRtb_R = module.exports.XF_8_LRtb_R = 1202;
var XF_8_LRtB_L = module.exports.XF_8_LRtB_L = 1203;
var XF_8_LRtB_C = module.exports.XF_8_LRtB_C = 1204;
var XF_8_LRtB_R = module.exports.XF_8_LRtB_R = 1205;
var XF_8_LRT_L = module.exports.XF_8_LRT_L = 1206;
var XF_8_LRT_C = module.exports.XF_8_LRT_C = 1207;
var XF_8_LRT_R = module.exports.XF_8_LRT_R = 1208;
var XF_8_LRTb_L = module.exports.XF_8_LRTb_L = 1209;
var XF_8_LRTb_C = module.exports.XF_8_LRTb_C = 1210;
var XF_8_LRTb_R = module.exports.XF_8_LRTb_R = 1211;
var XF_8_LRTB_L = module.exports.XF_8_LRTB_L = 1212;
var XF_8_LRTB_C = module.exports.XF_8_LRTB_C = 1213;
var XF_8_LRTB_R = module.exports.XF_8_LRTB_R = 1214;
var XF_8_GRAY_L = module.exports.XF_8_GRAY_L = 1215;
var XF_8_GRAY_C = module.exports.XF_8_GRAY_C = 1216;
var XF_8_GRAY_R = module.exports.XF_8_GRAY_R = 1217;
var XF_8_GRAY_b_L = module.exports.XF_8_GRAY_b_L = 1218;
var XF_8_GRAY_b_C = module.exports.XF_8_GRAY_b_C = 1219;
var XF_8_GRAY_b_R = module.exports.XF_8_GRAY_b_R = 1220;
var XF_8_GRAY_B_L = module.exports.XF_8_GRAY_B_L = 1221;
var XF_8_GRAY_B_C = module.exports.XF_8_GRAY_B_C = 1222;
var XF_8_GRAY_B_R = module.exports.XF_8_GRAY_B_R = 1223;
var XF_8_GRAY_t_L = module.exports.XF_8_GRAY_t_L = 1224;
var XF_8_GRAY_t_C = module.exports.XF_8_GRAY_t_C = 1225;
var XF_8_GRAY_t_R = module.exports.XF_8_GRAY_t_R = 1226;
var XF_8_GRAY_tb_L = module.exports.XF_8_GRAY_tb_L = 1227;
var XF_8_GRAY_tb_C = module.exports.XF_8_GRAY_tb_C = 1228;
var XF_8_GRAY_tb_R = module.exports.XF_8_GRAY_tb_R = 1229;
var XF_8_GRAY_tB_L = module.exports.XF_8_GRAY_tB_L = 1230;
var XF_8_GRAY_tB_C = module.exports.XF_8_GRAY_tB_C = 1231;
var XF_8_GRAY_tB_R = module.exports.XF_8_GRAY_tB_R = 1232;
var XF_8_GRAY_T_L = module.exports.XF_8_GRAY_T_L = 1233;
var XF_8_GRAY_T_C = module.exports.XF_8_GRAY_T_C = 1234;
var XF_8_GRAY_T_R = module.exports.XF_8_GRAY_T_R = 1235;
var XF_8_GRAY_Tb_L = module.exports.XF_8_GRAY_Tb_L = 1236;
var XF_8_GRAY_Tb_C = module.exports.XF_8_GRAY_Tb_C = 1237;
var XF_8_GRAY_Tb_R = module.exports.XF_8_GRAY_Tb_R = 1238;
var XF_8_GRAY_TB_L = module.exports.XF_8_GRAY_TB_L = 1239;
var XF_8_GRAY_TB_C = module.exports.XF_8_GRAY_TB_C = 1240;
var XF_8_GRAY_TB_R = module.exports.XF_8_GRAY_TB_R = 1241;
var XF_8_GRAY_r_L = module.exports.XF_8_GRAY_r_L = 1242;
var XF_8_GRAY_r_C = module.exports.XF_8_GRAY_r_C = 1243;
var XF_8_GRAY_r_R = module.exports.XF_8_GRAY_r_R = 1244;
var XF_8_GRAY_rb_L = module.exports.XF_8_GRAY_rb_L = 1245;
var XF_8_GRAY_rb_C = module.exports.XF_8_GRAY_rb_C = 1246;
var XF_8_GRAY_rb_R = module.exports.XF_8_GRAY_rb_R = 1247;
var XF_8_GRAY_rB_L = module.exports.XF_8_GRAY_rB_L = 1248;
var XF_8_GRAY_rB_C = module.exports.XF_8_GRAY_rB_C = 1249;
var XF_8_GRAY_rB_R = module.exports.XF_8_GRAY_rB_R = 1250;
var XF_8_GRAY_rt_L = module.exports.XF_8_GRAY_rt_L = 1251;
var XF_8_GRAY_rt_C = module.exports.XF_8_GRAY_rt_C = 1252;
var XF_8_GRAY_rt_R = module.exports.XF_8_GRAY_rt_R = 1253;
var XF_8_GRAY_rtb_L = module.exports.XF_8_GRAY_rtb_L = 1254;
var XF_8_GRAY_rtb_C = module.exports.XF_8_GRAY_rtb_C = 1255;
var XF_8_GRAY_rtb_R = module.exports.XF_8_GRAY_rtb_R = 1256;
var XF_8_GRAY_rtB_L = module.exports.XF_8_GRAY_rtB_L = 1257;
var XF_8_GRAY_rtB_C = module.exports.XF_8_GRAY_rtB_C = 1258;
var XF_8_GRAY_rtB_R = module.exports.XF_8_GRAY_rtB_R = 1259;
var XF_8_GRAY_rT_L = module.exports.XF_8_GRAY_rT_L = 1260;
var XF_8_GRAY_rT_C = module.exports.XF_8_GRAY_rT_C = 1261;
var XF_8_GRAY_rT_R = module.exports.XF_8_GRAY_rT_R = 1262;
var XF_8_GRAY_rTb_L = module.exports.XF_8_GRAY_rTb_L = 1263;
var XF_8_GRAY_rTb_C = module.exports.XF_8_GRAY_rTb_C = 1264;
var XF_8_GRAY_rTb_R = module.exports.XF_8_GRAY_rTb_R = 1265;
var XF_8_GRAY_rTB_L = module.exports.XF_8_GRAY_rTB_L = 1266;
var XF_8_GRAY_rTB_C = module.exports.XF_8_GRAY_rTB_C = 1267;
var XF_8_GRAY_rTB_R = module.exports.XF_8_GRAY_rTB_R = 1268;
var XF_8_GRAY_R_L = module.exports.XF_8_GRAY_R_L = 1269;
var XF_8_GRAY_R_C = module.exports.XF_8_GRAY_R_C = 1270;
var XF_8_GRAY_R_R = module.exports.XF_8_GRAY_R_R = 1271;
var XF_8_GRAY_Rb_L = module.exports.XF_8_GRAY_Rb_L = 1272;
var XF_8_GRAY_Rb_C = module.exports.XF_8_GRAY_Rb_C = 1273;
var XF_8_GRAY_Rb_R = module.exports.XF_8_GRAY_Rb_R = 1274;
var XF_8_GRAY_RB_L = module.exports.XF_8_GRAY_RB_L = 1275;
var XF_8_GRAY_RB_C = module.exports.XF_8_GRAY_RB_C = 1276;
var XF_8_GRAY_RB_R = module.exports.XF_8_GRAY_RB_R = 1277;
var XF_8_GRAY_Rt_L = module.exports.XF_8_GRAY_Rt_L = 1278;
var XF_8_GRAY_Rt_C = module.exports.XF_8_GRAY_Rt_C = 1279;
var XF_8_GRAY_Rt_R = module.exports.XF_8_GRAY_Rt_R = 1280;
var XF_8_GRAY_Rtb_L = module.exports.XF_8_GRAY_Rtb_L = 1281;
var XF_8_GRAY_Rtb_C = module.exports.XF_8_GRAY_Rtb_C = 1282;
var XF_8_GRAY_Rtb_R = module.exports.XF_8_GRAY_Rtb_R = 1283;
var XF_8_GRAY_RtB_L = module.exports.XF_8_GRAY_RtB_L = 1284;
var XF_8_GRAY_RtB_C = module.exports.XF_8_GRAY_RtB_C = 1285;
var XF_8_GRAY_RtB_R = module.exports.XF_8_GRAY_RtB_R = 1286;
var XF_8_GRAY_RT_L = module.exports.XF_8_GRAY_RT_L = 1287;
var XF_8_GRAY_RT_C = module.exports.XF_8_GRAY_RT_C = 1288;
var XF_8_GRAY_RT_R = module.exports.XF_8_GRAY_RT_R = 1289;
var XF_8_GRAY_RTb_L = module.exports.XF_8_GRAY_RTb_L = 1290;
var XF_8_GRAY_RTb_C = module.exports.XF_8_GRAY_RTb_C = 1291;
var XF_8_GRAY_RTb_R = module.exports.XF_8_GRAY_RTb_R = 1292;
var XF_8_GRAY_RTB_L = module.exports.XF_8_GRAY_RTB_L = 1293;
var XF_8_GRAY_RTB_C = module.exports.XF_8_GRAY_RTB_C = 1294;
var XF_8_GRAY_RTB_R = module.exports.XF_8_GRAY_RTB_R = 1295;
var XF_8_GRAY_l_L = module.exports.XF_8_GRAY_l_L = 1296;
var XF_8_GRAY_l_C = module.exports.XF_8_GRAY_l_C = 1297;
var XF_8_GRAY_l_R = module.exports.XF_8_GRAY_l_R = 1298;
var XF_8_GRAY_lb_L = module.exports.XF_8_GRAY_lb_L = 1299;
var XF_8_GRAY_lb_C = module.exports.XF_8_GRAY_lb_C = 1300;
var XF_8_GRAY_lb_R = module.exports.XF_8_GRAY_lb_R = 1301;
var XF_8_GRAY_lB_L = module.exports.XF_8_GRAY_lB_L = 1302;
var XF_8_GRAY_lB_C = module.exports.XF_8_GRAY_lB_C = 1303;
var XF_8_GRAY_lB_R = module.exports.XF_8_GRAY_lB_R = 1304;
var XF_8_GRAY_lt_L = module.exports.XF_8_GRAY_lt_L = 1305;
var XF_8_GRAY_lt_C = module.exports.XF_8_GRAY_lt_C = 1306;
var XF_8_GRAY_lt_R = module.exports.XF_8_GRAY_lt_R = 1307;
var XF_8_GRAY_ltb_L = module.exports.XF_8_GRAY_ltb_L = 1308;
var XF_8_GRAY_ltb_C = module.exports.XF_8_GRAY_ltb_C = 1309;
var XF_8_GRAY_ltb_R = module.exports.XF_8_GRAY_ltb_R = 1310;
var XF_8_GRAY_ltB_L = module.exports.XF_8_GRAY_ltB_L = 1311;
var XF_8_GRAY_ltB_C = module.exports.XF_8_GRAY_ltB_C = 1312;
var XF_8_GRAY_ltB_R = module.exports.XF_8_GRAY_ltB_R = 1313;
var XF_8_GRAY_lT_L = module.exports.XF_8_GRAY_lT_L = 1314;
var XF_8_GRAY_lT_C = module.exports.XF_8_GRAY_lT_C = 1315;
var XF_8_GRAY_lT_R = module.exports.XF_8_GRAY_lT_R = 1316;
var XF_8_GRAY_lTb_L = module.exports.XF_8_GRAY_lTb_L = 1317;
var XF_8_GRAY_lTb_C = module.exports.XF_8_GRAY_lTb_C = 1318;
var XF_8_GRAY_lTb_R = module.exports.XF_8_GRAY_lTb_R = 1319;
var XF_8_GRAY_lTB_L = module.exports.XF_8_GRAY_lTB_L = 1320;
var XF_8_GRAY_lTB_C = module.exports.XF_8_GRAY_lTB_C = 1321;
var XF_8_GRAY_lTB_R = module.exports.XF_8_GRAY_lTB_R = 1322;
var XF_8_GRAY_lr_L = module.exports.XF_8_GRAY_lr_L = 1323;
var XF_8_GRAY_lr_C = module.exports.XF_8_GRAY_lr_C = 1324;
var XF_8_GRAY_lr_R = module.exports.XF_8_GRAY_lr_R = 1325;
var XF_8_GRAY_lrb_L = module.exports.XF_8_GRAY_lrb_L = 1326;
var XF_8_GRAY_lrb_C = module.exports.XF_8_GRAY_lrb_C = 1327;
var XF_8_GRAY_lrb_R = module.exports.XF_8_GRAY_lrb_R = 1328;
var XF_8_GRAY_lrB_L = module.exports.XF_8_GRAY_lrB_L = 1329;
var XF_8_GRAY_lrB_C = module.exports.XF_8_GRAY_lrB_C = 1330;
var XF_8_GRAY_lrB_R = module.exports.XF_8_GRAY_lrB_R = 1331;
var XF_8_GRAY_lrt_L = module.exports.XF_8_GRAY_lrt_L = 1332;
var XF_8_GRAY_lrt_C = module.exports.XF_8_GRAY_lrt_C = 1333;
var XF_8_GRAY_lrt_R = module.exports.XF_8_GRAY_lrt_R = 1334;
var XF_8_GRAY_lrtb_L = module.exports.XF_8_GRAY_lrtb_L = 1335;
var XF_8_GRAY_lrtb_C = module.exports.XF_8_GRAY_lrtb_C = 1336;
var XF_8_GRAY_lrtb_R = module.exports.XF_8_GRAY_lrtb_R = 1337;
var XF_8_GRAY_lrtB_L = module.exports.XF_8_GRAY_lrtB_L = 1338;
var XF_8_GRAY_lrtB_C = module.exports.XF_8_GRAY_lrtB_C = 1339;
var XF_8_GRAY_lrtB_R = module.exports.XF_8_GRAY_lrtB_R = 1340;
var XF_8_GRAY_lrT_L = module.exports.XF_8_GRAY_lrT_L = 1341;
var XF_8_GRAY_lrT_C = module.exports.XF_8_GRAY_lrT_C = 1342;
var XF_8_GRAY_lrT_R = module.exports.XF_8_GRAY_lrT_R = 1343;
var XF_8_GRAY_lrTb_L = module.exports.XF_8_GRAY_lrTb_L = 1344;
var XF_8_GRAY_lrTb_C = module.exports.XF_8_GRAY_lrTb_C = 1345;
var XF_8_GRAY_lrTb_R = module.exports.XF_8_GRAY_lrTb_R = 1346;
var XF_8_GRAY_lrTB_L = module.exports.XF_8_GRAY_lrTB_L = 1347;
var XF_8_GRAY_lrTB_C = module.exports.XF_8_GRAY_lrTB_C = 1348;
var XF_8_GRAY_lrTB_R = module.exports.XF_8_GRAY_lrTB_R = 1349;
var XF_8_GRAY_lR_L = module.exports.XF_8_GRAY_lR_L = 1350;
var XF_8_GRAY_lR_C = module.exports.XF_8_GRAY_lR_C = 1351;
var XF_8_GRAY_lR_R = module.exports.XF_8_GRAY_lR_R = 1352;
var XF_8_GRAY_lRb_L = module.exports.XF_8_GRAY_lRb_L = 1353;
var XF_8_GRAY_lRb_C = module.exports.XF_8_GRAY_lRb_C = 1354;
var XF_8_GRAY_lRb_R = module.exports.XF_8_GRAY_lRb_R = 1355;
var XF_8_GRAY_lRB_L = module.exports.XF_8_GRAY_lRB_L = 1356;
var XF_8_GRAY_lRB_C = module.exports.XF_8_GRAY_lRB_C = 1357;
var XF_8_GRAY_lRB_R = module.exports.XF_8_GRAY_lRB_R = 1358;
var XF_8_GRAY_lRt_L = module.exports.XF_8_GRAY_lRt_L = 1359;
var XF_8_GRAY_lRt_C = module.exports.XF_8_GRAY_lRt_C = 1360;
var XF_8_GRAY_lRt_R = module.exports.XF_8_GRAY_lRt_R = 1361;
var XF_8_GRAY_lRtb_L = module.exports.XF_8_GRAY_lRtb_L = 1362;
var XF_8_GRAY_lRtb_C = module.exports.XF_8_GRAY_lRtb_C = 1363;
var XF_8_GRAY_lRtb_R = module.exports.XF_8_GRAY_lRtb_R = 1364;
var XF_8_GRAY_lRtB_L = module.exports.XF_8_GRAY_lRtB_L = 1365;
var XF_8_GRAY_lRtB_C = module.exports.XF_8_GRAY_lRtB_C = 1366;
var XF_8_GRAY_lRtB_R = module.exports.XF_8_GRAY_lRtB_R = 1367;
var XF_8_GRAY_lRT_L = module.exports.XF_8_GRAY_lRT_L = 1368;
var XF_8_GRAY_lRT_C = module.exports.XF_8_GRAY_lRT_C = 1369;
var XF_8_GRAY_lRT_R = module.exports.XF_8_GRAY_lRT_R = 1370;
var XF_8_GRAY_lRTb_L = module.exports.XF_8_GRAY_lRTb_L = 1371;
var XF_8_GRAY_lRTb_C = module.exports.XF_8_GRAY_lRTb_C = 1372;
var XF_8_GRAY_lRTb_R = module.exports.XF_8_GRAY_lRTb_R = 1373;
var XF_8_GRAY_lRTB_L = module.exports.XF_8_GRAY_lRTB_L = 1374;
var XF_8_GRAY_lRTB_C = module.exports.XF_8_GRAY_lRTB_C = 1375;
var XF_8_GRAY_lRTB_R = module.exports.XF_8_GRAY_lRTB_R = 1376;
var XF_8_GRAY_L_L = module.exports.XF_8_GRAY_L_L = 1377;
var XF_8_GRAY_L_C = module.exports.XF_8_GRAY_L_C = 1378;
var XF_8_GRAY_L_R = module.exports.XF_8_GRAY_L_R = 1379;
var XF_8_GRAY_Lb_L = module.exports.XF_8_GRAY_Lb_L = 1380;
var XF_8_GRAY_Lb_C = module.exports.XF_8_GRAY_Lb_C = 1381;
var XF_8_GRAY_Lb_R = module.exports.XF_8_GRAY_Lb_R = 1382;
var XF_8_GRAY_LB_L = module.exports.XF_8_GRAY_LB_L = 1383;
var XF_8_GRAY_LB_C = module.exports.XF_8_GRAY_LB_C = 1384;
var XF_8_GRAY_LB_R = module.exports.XF_8_GRAY_LB_R = 1385;
var XF_8_GRAY_Lt_L = module.exports.XF_8_GRAY_Lt_L = 1386;
var XF_8_GRAY_Lt_C = module.exports.XF_8_GRAY_Lt_C = 1387;
var XF_8_GRAY_Lt_R = module.exports.XF_8_GRAY_Lt_R = 1388;
var XF_8_GRAY_Ltb_L = module.exports.XF_8_GRAY_Ltb_L = 1389;
var XF_8_GRAY_Ltb_C = module.exports.XF_8_GRAY_Ltb_C = 1390;
var XF_8_GRAY_Ltb_R = module.exports.XF_8_GRAY_Ltb_R = 1391;
var XF_8_GRAY_LtB_L = module.exports.XF_8_GRAY_LtB_L = 1392;
var XF_8_GRAY_LtB_C = module.exports.XF_8_GRAY_LtB_C = 1393;
var XF_8_GRAY_LtB_R = module.exports.XF_8_GRAY_LtB_R = 1394;
var XF_8_GRAY_LT_L = module.exports.XF_8_GRAY_LT_L = 1395;
var XF_8_GRAY_LT_C = module.exports.XF_8_GRAY_LT_C = 1396;
var XF_8_GRAY_LT_R = module.exports.XF_8_GRAY_LT_R = 1397;
var XF_8_GRAY_LTb_L = module.exports.XF_8_GRAY_LTb_L = 1398;
var XF_8_GRAY_LTb_C = module.exports.XF_8_GRAY_LTb_C = 1399;
var XF_8_GRAY_LTb_R = module.exports.XF_8_GRAY_LTb_R = 1400;
var XF_8_GRAY_LTB_L = module.exports.XF_8_GRAY_LTB_L = 1401;
var XF_8_GRAY_LTB_C = module.exports.XF_8_GRAY_LTB_C = 1402;
var XF_8_GRAY_LTB_R = module.exports.XF_8_GRAY_LTB_R = 1403;
var XF_8_GRAY_Lr_L = module.exports.XF_8_GRAY_Lr_L = 1404;
var XF_8_GRAY_Lr_C = module.exports.XF_8_GRAY_Lr_C = 1405;
var XF_8_GRAY_Lr_R = module.exports.XF_8_GRAY_Lr_R = 1406;
var XF_8_GRAY_Lrb_L = module.exports.XF_8_GRAY_Lrb_L = 1407;
var XF_8_GRAY_Lrb_C = module.exports.XF_8_GRAY_Lrb_C = 1408;
var XF_8_GRAY_Lrb_R = module.exports.XF_8_GRAY_Lrb_R = 1409;
var XF_8_GRAY_LrB_L = module.exports.XF_8_GRAY_LrB_L = 1410;
var XF_8_GRAY_LrB_C = module.exports.XF_8_GRAY_LrB_C = 1411;
var XF_8_GRAY_LrB_R = module.exports.XF_8_GRAY_LrB_R = 1412;
var XF_8_GRAY_Lrt_L = module.exports.XF_8_GRAY_Lrt_L = 1413;
var XF_8_GRAY_Lrt_C = module.exports.XF_8_GRAY_Lrt_C = 1414;
var XF_8_GRAY_Lrt_R = module.exports.XF_8_GRAY_Lrt_R = 1415;
var XF_8_GRAY_Lrtb_L = module.exports.XF_8_GRAY_Lrtb_L = 1416;
var XF_8_GRAY_Lrtb_C = module.exports.XF_8_GRAY_Lrtb_C = 1417;
var XF_8_GRAY_Lrtb_R = module.exports.XF_8_GRAY_Lrtb_R = 1418;
var XF_8_GRAY_LrtB_L = module.exports.XF_8_GRAY_LrtB_L = 1419;
var XF_8_GRAY_LrtB_C = module.exports.XF_8_GRAY_LrtB_C = 1420;
var XF_8_GRAY_LrtB_R = module.exports.XF_8_GRAY_LrtB_R = 1421;
var XF_8_GRAY_LrT_L = module.exports.XF_8_GRAY_LrT_L = 1422;
var XF_8_GRAY_LrT_C = module.exports.XF_8_GRAY_LrT_C = 1423;
var XF_8_GRAY_LrT_R = module.exports.XF_8_GRAY_LrT_R = 1424;
var XF_8_GRAY_LrTb_L = module.exports.XF_8_GRAY_LrTb_L = 1425;
var XF_8_GRAY_LrTb_C = module.exports.XF_8_GRAY_LrTb_C = 1426;
var XF_8_GRAY_LrTb_R = module.exports.XF_8_GRAY_LrTb_R = 1427;
var XF_8_GRAY_LrTB_L = module.exports.XF_8_GRAY_LrTB_L = 1428;
var XF_8_GRAY_LrTB_C = module.exports.XF_8_GRAY_LrTB_C = 1429;
var XF_8_GRAY_LrTB_R = module.exports.XF_8_GRAY_LrTB_R = 1430;
var XF_8_GRAY_LR_L = module.exports.XF_8_GRAY_LR_L = 1431;
var XF_8_GRAY_LR_C = module.exports.XF_8_GRAY_LR_C = 1432;
var XF_8_GRAY_LR_R = module.exports.XF_8_GRAY_LR_R = 1433;
var XF_8_GRAY_LRb_L = module.exports.XF_8_GRAY_LRb_L = 1434;
var XF_8_GRAY_LRb_C = module.exports.XF_8_GRAY_LRb_C = 1435;
var XF_8_GRAY_LRb_R = module.exports.XF_8_GRAY_LRb_R = 1436;
var XF_8_GRAY_LRB_L = module.exports.XF_8_GRAY_LRB_L = 1437;
var XF_8_GRAY_LRB_C = module.exports.XF_8_GRAY_LRB_C = 1438;
var XF_8_GRAY_LRB_R = module.exports.XF_8_GRAY_LRB_R = 1439;
var XF_8_GRAY_LRt_L = module.exports.XF_8_GRAY_LRt_L = 1440;
var XF_8_GRAY_LRt_C = module.exports.XF_8_GRAY_LRt_C = 1441;
var XF_8_GRAY_LRt_R = module.exports.XF_8_GRAY_LRt_R = 1442;
var XF_8_GRAY_LRtb_L = module.exports.XF_8_GRAY_LRtb_L = 1443;
var XF_8_GRAY_LRtb_C = module.exports.XF_8_GRAY_LRtb_C = 1444;
var XF_8_GRAY_LRtb_R = module.exports.XF_8_GRAY_LRtb_R = 1445;
var XF_8_GRAY_LRtB_L = module.exports.XF_8_GRAY_LRtB_L = 1446;
var XF_8_GRAY_LRtB_C = module.exports.XF_8_GRAY_LRtB_C = 1447;
var XF_8_GRAY_LRtB_R = module.exports.XF_8_GRAY_LRtB_R = 1448;
var XF_8_GRAY_LRT_L = module.exports.XF_8_GRAY_LRT_L = 1449;
var XF_8_GRAY_LRT_C = module.exports.XF_8_GRAY_LRT_C = 1450;
var XF_8_GRAY_LRT_R = module.exports.XF_8_GRAY_LRT_R = 1451;
var XF_8_GRAY_LRTb_L = module.exports.XF_8_GRAY_LRTb_L = 1452;
var XF_8_GRAY_LRTb_C = module.exports.XF_8_GRAY_LRTb_C = 1453;
var XF_8_GRAY_LRTb_R = module.exports.XF_8_GRAY_LRTb_R = 1454;
var XF_8_GRAY_LRTB_L = module.exports.XF_8_GRAY_LRTB_L = 1455;
var XF_8_GRAY_LRTB_C = module.exports.XF_8_GRAY_LRTB_C = 1456;
var XF_8_GRAY_LRTB_R = module.exports.XF_8_GRAY_LRTB_R = 1457;
var XF_B8_L = module.exports.XF_B8_L = 1458;
var XF_B8_C = module.exports.XF_B8_C = 1459;
var XF_B8_R = module.exports.XF_B8_R = 1460;
var XF_B8_b_L = module.exports.XF_B8_b_L = 1461;
var XF_B8_b_C = module.exports.XF_B8_b_C = 1462;
var XF_B8_b_R = module.exports.XF_B8_b_R = 1463;
var XF_B8_B_L = module.exports.XF_B8_B_L = 1464;
var XF_B8_B_C = module.exports.XF_B8_B_C = 1465;
var XF_B8_B_R = module.exports.XF_B8_B_R = 1466;
var XF_B8_t_L = module.exports.XF_B8_t_L = 1467;
var XF_B8_t_C = module.exports.XF_B8_t_C = 1468;
var XF_B8_t_R = module.exports.XF_B8_t_R = 1469;
var XF_B8_tb_L = module.exports.XF_B8_tb_L = 1470;
var XF_B8_tb_C = module.exports.XF_B8_tb_C = 1471;
var XF_B8_tb_R = module.exports.XF_B8_tb_R = 1472;
var XF_B8_tB_L = module.exports.XF_B8_tB_L = 1473;
var XF_B8_tB_C = module.exports.XF_B8_tB_C = 1474;
var XF_B8_tB_R = module.exports.XF_B8_tB_R = 1475;
var XF_B8_T_L = module.exports.XF_B8_T_L = 1476;
var XF_B8_T_C = module.exports.XF_B8_T_C = 1477;
var XF_B8_T_R = module.exports.XF_B8_T_R = 1478;
var XF_B8_Tb_L = module.exports.XF_B8_Tb_L = 1479;
var XF_B8_Tb_C = module.exports.XF_B8_Tb_C = 1480;
var XF_B8_Tb_R = module.exports.XF_B8_Tb_R = 1481;
var XF_B8_TB_L = module.exports.XF_B8_TB_L = 1482;
var XF_B8_TB_C = module.exports.XF_B8_TB_C = 1483;
var XF_B8_TB_R = module.exports.XF_B8_TB_R = 1484;
var XF_B8_r_L = module.exports.XF_B8_r_L = 1485;
var XF_B8_r_C = module.exports.XF_B8_r_C = 1486;
var XF_B8_r_R = module.exports.XF_B8_r_R = 1487;
var XF_B8_rb_L = module.exports.XF_B8_rb_L = 1488;
var XF_B8_rb_C = module.exports.XF_B8_rb_C = 1489;
var XF_B8_rb_R = module.exports.XF_B8_rb_R = 1490;
var XF_B8_rB_L = module.exports.XF_B8_rB_L = 1491;
var XF_B8_rB_C = module.exports.XF_B8_rB_C = 1492;
var XF_B8_rB_R = module.exports.XF_B8_rB_R = 1493;
var XF_B8_rt_L = module.exports.XF_B8_rt_L = 1494;
var XF_B8_rt_C = module.exports.XF_B8_rt_C = 1495;
var XF_B8_rt_R = module.exports.XF_B8_rt_R = 1496;
var XF_B8_rtb_L = module.exports.XF_B8_rtb_L = 1497;
var XF_B8_rtb_C = module.exports.XF_B8_rtb_C = 1498;
var XF_B8_rtb_R = module.exports.XF_B8_rtb_R = 1499;
var XF_B8_rtB_L = module.exports.XF_B8_rtB_L = 1500;
var XF_B8_rtB_C = module.exports.XF_B8_rtB_C = 1501;
var XF_B8_rtB_R = module.exports.XF_B8_rtB_R = 1502;
var XF_B8_rT_L = module.exports.XF_B8_rT_L = 1503;
var XF_B8_rT_C = module.exports.XF_B8_rT_C = 1504;
var XF_B8_rT_R = module.exports.XF_B8_rT_R = 1505;
var XF_B8_rTb_L = module.exports.XF_B8_rTb_L = 1506;
var XF_B8_rTb_C = module.exports.XF_B8_rTb_C = 15.5;
var XF_B8_rTb_R = module.exports.XF_B8_rTb_R = 1508;
var XF_B8_rTB_L = module.exports.XF_B8_rTB_L = 1509;
var XF_B8_rTB_C = module.exports.XF_B8_rTB_C = 1510;
var XF_B8_rTB_R = module.exports.XF_B8_rTB_R = 1511;
var XF_B8_R_L = module.exports.XF_B8_R_L = 1512;
var XF_B8_R_C = module.exports.XF_B8_R_C = 1513;
var XF_B8_R_R = module.exports.XF_B8_R_R = 1514;
var XF_B8_Rb_L = module.exports.XF_B8_Rb_L = 1515;
var XF_B8_Rb_C = module.exports.XF_B8_Rb_C = 1516;
var XF_B8_Rb_R = module.exports.XF_B8_Rb_R = 15.5;
var XF_B8_RB_L = module.exports.XF_B8_RB_L = 1518;
var XF_B8_RB_C = module.exports.XF_B8_RB_C = 1519;
var XF_B8_RB_R = module.exports.XF_B8_RB_R = 1520;
var XF_B8_Rt_L = module.exports.XF_B8_Rt_L = 1521;
var XF_B8_Rt_C = module.exports.XF_B8_Rt_C = 1522;
var XF_B8_Rt_R = module.exports.XF_B8_Rt_R = 1523;
var XF_B8_Rtb_L = module.exports.XF_B8_Rtb_L = 1524;
var XF_B8_Rtb_C = module.exports.XF_B8_Rtb_C = 1525;
var XF_B8_Rtb_R = module.exports.XF_B8_Rtb_R = 1526;
var XF_B8_RtB_L = module.exports.XF_B8_RtB_L = 15.5;
var XF_B8_RtB_C = module.exports.XF_B8_RtB_C = 1528;
var XF_B8_RtB_R = module.exports.XF_B8_RtB_R = 1529;
var XF_B8_RT_L = module.exports.XF_B8_RT_L = 1530;
var XF_B8_RT_C = module.exports.XF_B8_RT_C = 1531;
var XF_B8_RT_R = module.exports.XF_B8_RT_R = 1532;
var XF_B8_RTb_L = module.exports.XF_B8_RTb_L = 1533;
var XF_B8_RTb_C = module.exports.XF_B8_RTb_C = 1534;
var XF_B8_RTb_R = module.exports.XF_B8_RTb_R = 1535;
var XF_B8_RTB_L = module.exports.XF_B8_RTB_L = 1536;
var XF_B8_RTB_C = module.exports.XF_B8_RTB_C = 15.5;
var XF_B8_RTB_R = module.exports.XF_B8_RTB_R = 1538;
var XF_B8_l_L = module.exports.XF_B8_l_L = 1539;
var XF_B8_l_C = module.exports.XF_B8_l_C = 1540;
var XF_B8_l_R = module.exports.XF_B8_l_R = 1541;
var XF_B8_lb_L = module.exports.XF_B8_lb_L = 1542;
var XF_B8_lb_C = module.exports.XF_B8_lb_C = 1543;
var XF_B8_lb_R = module.exports.XF_B8_lb_R = 1544;
var XF_B8_lB_L = module.exports.XF_B8_lB_L = 1545;
var XF_B8_lB_C = module.exports.XF_B8_lB_C = 1546;
var XF_B8_lB_R = module.exports.XF_B8_lB_R = 15.5;
var XF_B8_lt_L = module.exports.XF_B8_lt_L = 1548;
var XF_B8_lt_C = module.exports.XF_B8_lt_C = 1549;
var XF_B8_lt_R = module.exports.XF_B8_lt_R = 1550;
var XF_B8_ltb_L = module.exports.XF_B8_ltb_L = 1551;
var XF_B8_ltb_C = module.exports.XF_B8_ltb_C = 1552;
var XF_B8_ltb_R = module.exports.XF_B8_ltb_R = 1553;
var XF_B8_ltB_L = module.exports.XF_B8_ltB_L = 1554;
var XF_B8_ltB_C = module.exports.XF_B8_ltB_C = 1555;
var XF_B8_ltB_R = module.exports.XF_B8_ltB_R = 1556;
var XF_B8_lT_L = module.exports.XF_B8_lT_L = 15.5;
var XF_B8_lT_C = module.exports.XF_B8_lT_C = 1558;
var XF_B8_lT_R = module.exports.XF_B8_lT_R = 1559;
var XF_B8_lTb_L = module.exports.XF_B8_lTb_L = 1560;
var XF_B8_lTb_C = module.exports.XF_B8_lTb_C = 1561;
var XF_B8_lTb_R = module.exports.XF_B8_lTb_R = 1562;
var XF_B8_lTB_L = module.exports.XF_B8_lTB_L = 1563;
var XF_B8_lTB_C = module.exports.XF_B8_lTB_C = 1564;
var XF_B8_lTB_R = module.exports.XF_B8_lTB_R = 1565;
var XF_B8_lr_L = module.exports.XF_B8_lr_L = 1566;
var XF_B8_lr_C = module.exports.XF_B8_lr_C = 15.5;
var XF_B8_lr_R = module.exports.XF_B8_lr_R = 1568;
var XF_B8_lrb_L = module.exports.XF_B8_lrb_L = 1569;
var XF_B8_lrb_C = module.exports.XF_B8_lrb_C = 1570;
var XF_B8_lrb_R = module.exports.XF_B8_lrb_R = 1571;
var XF_B8_lrB_L = module.exports.XF_B8_lrB_L = 1572;
var XF_B8_lrB_C = module.exports.XF_B8_lrB_C = 1573;
var XF_B8_lrB_R = module.exports.XF_B8_lrB_R = 1574;
var XF_B8_lrt_L = module.exports.XF_B8_lrt_L = 1575;
var XF_B8_lrt_C = module.exports.XF_B8_lrt_C = 1576;
var XF_B8_lrt_R = module.exports.XF_B8_lrt_R = 15.5;
var XF_B8_lrtb_L = module.exports.XF_B8_lrtb_L = 1578;
var XF_B8_lrtb_C = module.exports.XF_B8_lrtb_C = 1579;
var XF_B8_lrtb_R = module.exports.XF_B8_lrtb_R = 1580;
var XF_B8_lrtB_L = module.exports.XF_B8_lrtB_L = 1581;
var XF_B8_lrtB_C = module.exports.XF_B8_lrtB_C = 1582;
var XF_B8_lrtB_R = module.exports.XF_B8_lrtB_R = 1583;
var XF_B8_lrT_L = module.exports.XF_B8_lrT_L = 1584;
var XF_B8_lrT_C = module.exports.XF_B8_lrT_C = 1585;
var XF_B8_lrT_R = module.exports.XF_B8_lrT_R = 1586;
var XF_B8_lrTb_L = module.exports.XF_B8_lrTb_L = 15.5;
var XF_B8_lrTb_C = module.exports.XF_B8_lrTb_C = 1588;
var XF_B8_lrTb_R = module.exports.XF_B8_lrTb_R = 1589;
var XF_B8_lrTB_L = module.exports.XF_B8_lrTB_L = 1590;
var XF_B8_lrTB_C = module.exports.XF_B8_lrTB_C = 1591;
var XF_B8_lrTB_R = module.exports.XF_B8_lrTB_R = 1592;
var XF_B8_lR_L = module.exports.XF_B8_lR_L = 1593;
var XF_B8_lR_C = module.exports.XF_B8_lR_C = 1594;
var XF_B8_lR_R = module.exports.XF_B8_lR_R = 1595;
var XF_B8_lRb_L = module.exports.XF_B8_lRb_L = 1596;
var XF_B8_lRb_C = module.exports.XF_B8_lRb_C = 15.5;
var XF_B8_lRb_R = module.exports.XF_B8_lRb_R = 1598;
var XF_B8_lRB_L = module.exports.XF_B8_lRB_L = 1599;
var XF_B8_lRB_C = module.exports.XF_B8_lRB_C = 1600;
var XF_B8_lRB_R = module.exports.XF_B8_lRB_R = 1601;
var XF_B8_lRt_L = module.exports.XF_B8_lRt_L = 1602;
var XF_B8_lRt_C = module.exports.XF_B8_lRt_C = 1603;
var XF_B8_lRt_R = module.exports.XF_B8_lRt_R = 1604;
var XF_B8_lRtb_L = module.exports.XF_B8_lRtb_L = 1605;
var XF_B8_lRtb_C = module.exports.XF_B8_lRtb_C = 1606;
var XF_B8_lRtb_R = module.exports.XF_B8_lRtb_R = 1607;
var XF_B8_lRtB_L = module.exports.XF_B8_lRtB_L = 1608;
var XF_B8_lRtB_C = module.exports.XF_B8_lRtB_C = 1609;
var XF_B8_lRtB_R = module.exports.XF_B8_lRtB_R = 1610;
var XF_B8_lRT_L = module.exports.XF_B8_lRT_L = 1611;
var XF_B8_lRT_C = module.exports.XF_B8_lRT_C = 1612;
var XF_B8_lRT_R = module.exports.XF_B8_lRT_R = 1613;
var XF_B8_lRTb_L = module.exports.XF_B8_lRTb_L = 1614;
var XF_B8_lRTb_C = module.exports.XF_B8_lRTb_C = 1615;
var XF_B8_lRTb_R = module.exports.XF_B8_lRTb_R = 1616;
var XF_B8_lRTB_L = module.exports.XF_B8_lRTB_L = 1617;
var XF_B8_lRTB_C = module.exports.XF_B8_lRTB_C = 1618;
var XF_B8_lRTB_R = module.exports.XF_B8_lRTB_R = 1619;
var XF_B8_L_L = module.exports.XF_B8_L_L = 1620;
var XF_B8_L_C = module.exports.XF_B8_L_C = 1621;
var XF_B8_L_R = module.exports.XF_B8_L_R = 1622;
var XF_B8_Lb_L = module.exports.XF_B8_Lb_L = 1623;
var XF_B8_Lb_C = module.exports.XF_B8_Lb_C = 1624;
var XF_B8_Lb_R = module.exports.XF_B8_Lb_R = 1625;
var XF_B8_LB_L = module.exports.XF_B8_LB_L = 1626;
var XF_B8_LB_C = module.exports.XF_B8_LB_C = 1627;
var XF_B8_LB_R = module.exports.XF_B8_LB_R = 1628;
var XF_B8_Lt_L = module.exports.XF_B8_Lt_L = 1629;
var XF_B8_Lt_C = module.exports.XF_B8_Lt_C = 1630;
var XF_B8_Lt_R = module.exports.XF_B8_Lt_R = 1631;
var XF_B8_Ltb_L = module.exports.XF_B8_Ltb_L = 1632;
var XF_B8_Ltb_C = module.exports.XF_B8_Ltb_C = 1633;
var XF_B8_Ltb_R = module.exports.XF_B8_Ltb_R = 1634;
var XF_B8_LtB_L = module.exports.XF_B8_LtB_L = 1635;
var XF_B8_LtB_C = module.exports.XF_B8_LtB_C = 1636;
var XF_B8_LtB_R = module.exports.XF_B8_LtB_R = 1637;
var XF_B8_LT_L = module.exports.XF_B8_LT_L = 1638;
var XF_B8_LT_C = module.exports.XF_B8_LT_C = 1639;
var XF_B8_LT_R = module.exports.XF_B8_LT_R = 1640;
var XF_B8_LTb_L = module.exports.XF_B8_LTb_L = 1641;
var XF_B8_LTb_C = module.exports.XF_B8_LTb_C = 1642;
var XF_B8_LTb_R = module.exports.XF_B8_LTb_R = 1643;
var XF_B8_LTB_L = module.exports.XF_B8_LTB_L = 1644;
var XF_B8_LTB_C = module.exports.XF_B8_LTB_C = 1645;
var XF_B8_LTB_R = module.exports.XF_B8_LTB_R = 1646;
var XF_B8_Lr_L = module.exports.XF_B8_Lr_L = 1647;
var XF_B8_Lr_C = module.exports.XF_B8_Lr_C = 1648;
var XF_B8_Lr_R = module.exports.XF_B8_Lr_R = 1649;
var XF_B8_Lrb_L = module.exports.XF_B8_Lrb_L = 1650;
var XF_B8_Lrb_C = module.exports.XF_B8_Lrb_C = 1651;
var XF_B8_Lrb_R = module.exports.XF_B8_Lrb_R = 1652;
var XF_B8_LrB_L = module.exports.XF_B8_LrB_L = 1653;
var XF_B8_LrB_C = module.exports.XF_B8_LrB_C = 1654;
var XF_B8_LrB_R = module.exports.XF_B8_LrB_R = 1655;
var XF_B8_Lrt_L = module.exports.XF_B8_Lrt_L = 1656;
var XF_B8_Lrt_C = module.exports.XF_B8_Lrt_C = 1657;
var XF_B8_Lrt_R = module.exports.XF_B8_Lrt_R = 1658;
var XF_B8_Lrtb_L = module.exports.XF_B8_Lrtb_L = 1659;
var XF_B8_Lrtb_C = module.exports.XF_B8_Lrtb_C = 1660;
var XF_B8_Lrtb_R = module.exports.XF_B8_Lrtb_R = 1661;
var XF_B8_LrtB_L = module.exports.XF_B8_LrtB_L = 1662;
var XF_B8_LrtB_C = module.exports.XF_B8_LrtB_C = 1663;
var XF_B8_LrtB_R = module.exports.XF_B8_LrtB_R = 1664;
var XF_B8_LrT_L = module.exports.XF_B8_LrT_L = 1665;
var XF_B8_LrT_C = module.exports.XF_B8_LrT_C = 1666;
var XF_B8_LrT_R = module.exports.XF_B8_LrT_R = 1667;
var XF_B8_LrTb_L = module.exports.XF_B8_LrTb_L = 1668;
var XF_B8_LrTb_C = module.exports.XF_B8_LrTb_C = 1669;
var XF_B8_LrTb_R = module.exports.XF_B8_LrTb_R = 1670;
var XF_B8_LrTB_L = module.exports.XF_B8_LrTB_L = 1671;
var XF_B8_LrTB_C = module.exports.XF_B8_LrTB_C = 1672;
var XF_B8_LrTB_R = module.exports.XF_B8_LrTB_R = 1673;
var XF_B8_LR_L = module.exports.XF_B8_LR_L = 1674;
var XF_B8_LR_C = module.exports.XF_B8_LR_C = 1675;
var XF_B8_LR_R = module.exports.XF_B8_LR_R = 1676;
var XF_B8_LRb_L = module.exports.XF_B8_LRb_L = 1677;
var XF_B8_LRb_C = module.exports.XF_B8_LRb_C = 1678;
var XF_B8_LRb_R = module.exports.XF_B8_LRb_R = 1679;
var XF_B8_LRB_L = module.exports.XF_B8_LRB_L = 1680;
var XF_B8_LRB_C = module.exports.XF_B8_LRB_C = 1681;
var XF_B8_LRB_R = module.exports.XF_B8_LRB_R = 1682;
var XF_B8_LRt_L = module.exports.XF_B8_LRt_L = 1683;
var XF_B8_LRt_C = module.exports.XF_B8_LRt_C = 1684;
var XF_B8_LRt_R = module.exports.XF_B8_LRt_R = 1685;
var XF_B8_LRtb_L = module.exports.XF_B8_LRtb_L = 1686;
var XF_B8_LRtb_C = module.exports.XF_B8_LRtb_C = 1687;
var XF_B8_LRtb_R = module.exports.XF_B8_LRtb_R = 1688;
var XF_B8_LRtB_L = module.exports.XF_B8_LRtB_L = 1689;
var XF_B8_LRtB_C = module.exports.XF_B8_LRtB_C = 1690;
var XF_B8_LRtB_R = module.exports.XF_B8_LRtB_R = 1691;
var XF_B8_LRT_L = module.exports.XF_B8_LRT_L = 1692;
var XF_B8_LRT_C = module.exports.XF_B8_LRT_C = 1693;
var XF_B8_LRT_R = module.exports.XF_B8_LRT_R = 1694;
var XF_B8_LRTb_L = module.exports.XF_B8_LRTb_L = 1695;
var XF_B8_LRTb_C = module.exports.XF_B8_LRTb_C = 1696;
var XF_B8_LRTb_R = module.exports.XF_B8_LRTb_R = 1697;
var XF_B8_LRTB_L = module.exports.XF_B8_LRTB_L = 1698;
var XF_B8_LRTB_C = module.exports.XF_B8_LRTB_C = 1699;
var XF_B8_LRTB_R = module.exports.XF_B8_LRTB_R = 1700;
var XF_B8_GRAY_L = module.exports.XF_B8_GRAY_L = 1701;
var XF_B8_GRAY_C = module.exports.XF_B8_GRAY_C = 1702;
var XF_B8_GRAY_R = module.exports.XF_B8_GRAY_R = 1703;
var XF_B8_GRAY_b_L = module.exports.XF_B8_GRAY_b_L = 1704;
var XF_B8_GRAY_b_C = module.exports.XF_B8_GRAY_b_C = 1705;
var XF_B8_GRAY_b_R = module.exports.XF_B8_GRAY_b_R = 1706;
var XF_B8_GRAY_B_L = module.exports.XF_B8_GRAY_B_L = 1707;
var XF_B8_GRAY_B_C = module.exports.XF_B8_GRAY_B_C = 1708;
var XF_B8_GRAY_B_R = module.exports.XF_B8_GRAY_B_R = 1709;
var XF_B8_GRAY_t_L = module.exports.XF_B8_GRAY_t_L = 1710;
var XF_B8_GRAY_t_C = module.exports.XF_B8_GRAY_t_C = 1711;
var XF_B8_GRAY_t_R = module.exports.XF_B8_GRAY_t_R = 1712;
var XF_B8_GRAY_tb_L = module.exports.XF_B8_GRAY_tb_L = 1713;
var XF_B8_GRAY_tb_C = module.exports.XF_B8_GRAY_tb_C = 1714;
var XF_B8_GRAY_tb_R = module.exports.XF_B8_GRAY_tb_R = 1715;
var XF_B8_GRAY_tB_L = module.exports.XF_B8_GRAY_tB_L = 1716;
var XF_B8_GRAY_tB_C = module.exports.XF_B8_GRAY_tB_C = 1717;
var XF_B8_GRAY_tB_R = module.exports.XF_B8_GRAY_tB_R = 1718;
var XF_B8_GRAY_T_L = module.exports.XF_B8_GRAY_T_L = 1719;
var XF_B8_GRAY_T_C = module.exports.XF_B8_GRAY_T_C = 1720;
var XF_B8_GRAY_T_R = module.exports.XF_B8_GRAY_T_R = 1721;
var XF_B8_GRAY_Tb_L = module.exports.XF_B8_GRAY_Tb_L = 1722;
var XF_B8_GRAY_Tb_C = module.exports.XF_B8_GRAY_Tb_C = 1723;
var XF_B8_GRAY_Tb_R = module.exports.XF_B8_GRAY_Tb_R = 1724;
var XF_B8_GRAY_TB_L = module.exports.XF_B8_GRAY_TB_L = 1725;
var XF_B8_GRAY_TB_C = module.exports.XF_B8_GRAY_TB_C = 1726;
var XF_B8_GRAY_TB_R = module.exports.XF_B8_GRAY_TB_R = 1727;
var XF_B8_GRAY_r_L = module.exports.XF_B8_GRAY_r_L = 1728;
var XF_B8_GRAY_r_C = module.exports.XF_B8_GRAY_r_C = 1729;
var XF_B8_GRAY_r_R = module.exports.XF_B8_GRAY_r_R = 1730;
var XF_B8_GRAY_rb_L = module.exports.XF_B8_GRAY_rb_L = 1731;
var XF_B8_GRAY_rb_C = module.exports.XF_B8_GRAY_rb_C = 1732;
var XF_B8_GRAY_rb_R = module.exports.XF_B8_GRAY_rb_R = 1733;
var XF_B8_GRAY_rB_L = module.exports.XF_B8_GRAY_rB_L = 1734;
var XF_B8_GRAY_rB_C = module.exports.XF_B8_GRAY_rB_C = 1735;
var XF_B8_GRAY_rB_R = module.exports.XF_B8_GRAY_rB_R = 1736;
var XF_B8_GRAY_rt_L = module.exports.XF_B8_GRAY_rt_L = 1737;
var XF_B8_GRAY_rt_C = module.exports.XF_B8_GRAY_rt_C = 1738;
var XF_B8_GRAY_rt_R = module.exports.XF_B8_GRAY_rt_R = 1739;
var XF_B8_GRAY_rtb_L = module.exports.XF_B8_GRAY_rtb_L = 1740;
var XF_B8_GRAY_rtb_C = module.exports.XF_B8_GRAY_rtb_C = 1741;
var XF_B8_GRAY_rtb_R = module.exports.XF_B8_GRAY_rtb_R = 1742;
var XF_B8_GRAY_rtB_L = module.exports.XF_B8_GRAY_rtB_L = 1743;
var XF_B8_GRAY_rtB_C = module.exports.XF_B8_GRAY_rtB_C = 1744;
var XF_B8_GRAY_rtB_R = module.exports.XF_B8_GRAY_rtB_R = 1745;
var XF_B8_GRAY_rT_L = module.exports.XF_B8_GRAY_rT_L = 1746;
var XF_B8_GRAY_rT_C = module.exports.XF_B8_GRAY_rT_C = 1747;
var XF_B8_GRAY_rT_R = module.exports.XF_B8_GRAY_rT_R = 1748;
var XF_B8_GRAY_rTb_L = module.exports.XF_B8_GRAY_rTb_L = 1749;
var XF_B8_GRAY_rTb_C = module.exports.XF_B8_GRAY_rTb_C = 1750;
var XF_B8_GRAY_rTb_R = module.exports.XF_B8_GRAY_rTb_R = 1751;
var XF_B8_GRAY_rTB_L = module.exports.XF_B8_GRAY_rTB_L = 1752;
var XF_B8_GRAY_rTB_C = module.exports.XF_B8_GRAY_rTB_C = 1753;
var XF_B8_GRAY_rTB_R = module.exports.XF_B8_GRAY_rTB_R = 1754;
var XF_B8_GRAY_R_L = module.exports.XF_B8_GRAY_R_L = 1755;
var XF_B8_GRAY_R_C = module.exports.XF_B8_GRAY_R_C = 1756;
var XF_B8_GRAY_R_R = module.exports.XF_B8_GRAY_R_R = 1757;
var XF_B8_GRAY_Rb_L = module.exports.XF_B8_GRAY_Rb_L = 1758;
var XF_B8_GRAY_Rb_C = module.exports.XF_B8_GRAY_Rb_C = 1759;
var XF_B8_GRAY_Rb_R = module.exports.XF_B8_GRAY_Rb_R = 1760;
var XF_B8_GRAY_RB_L = module.exports.XF_B8_GRAY_RB_L = 1761;
var XF_B8_GRAY_RB_C = module.exports.XF_B8_GRAY_RB_C = 1762;
var XF_B8_GRAY_RB_R = module.exports.XF_B8_GRAY_RB_R = 1763;
var XF_B8_GRAY_Rt_L = module.exports.XF_B8_GRAY_Rt_L = 1764;
var XF_B8_GRAY_Rt_C = module.exports.XF_B8_GRAY_Rt_C = 1765;
var XF_B8_GRAY_Rt_R = module.exports.XF_B8_GRAY_Rt_R = 1766;
var XF_B8_GRAY_Rtb_L = module.exports.XF_B8_GRAY_Rtb_L = 1767;
var XF_B8_GRAY_Rtb_C = module.exports.XF_B8_GRAY_Rtb_C = 1768;
var XF_B8_GRAY_Rtb_R = module.exports.XF_B8_GRAY_Rtb_R = 1769;
var XF_B8_GRAY_RtB_L = module.exports.XF_B8_GRAY_RtB_L = 1770;
var XF_B8_GRAY_RtB_C = module.exports.XF_B8_GRAY_RtB_C = 1771;
var XF_B8_GRAY_RtB_R = module.exports.XF_B8_GRAY_RtB_R = 1772;
var XF_B8_GRAY_RT_L = module.exports.XF_B8_GRAY_RT_L = 1773;
var XF_B8_GRAY_RT_C = module.exports.XF_B8_GRAY_RT_C = 1774;
var XF_B8_GRAY_RT_R = module.exports.XF_B8_GRAY_RT_R = 1775;
var XF_B8_GRAY_RTb_L = module.exports.XF_B8_GRAY_RTb_L = 1776;
var XF_B8_GRAY_RTb_C = module.exports.XF_B8_GRAY_RTb_C = 1777;
var XF_B8_GRAY_RTb_R = module.exports.XF_B8_GRAY_RTb_R = 1778;
var XF_B8_GRAY_RTB_L = module.exports.XF_B8_GRAY_RTB_L = 1779;
var XF_B8_GRAY_RTB_C = module.exports.XF_B8_GRAY_RTB_C = 1780;
var XF_B8_GRAY_RTB_R = module.exports.XF_B8_GRAY_RTB_R = 1781;
var XF_B8_GRAY_l_L = module.exports.XF_B8_GRAY_l_L = 1782;
var XF_B8_GRAY_l_C = module.exports.XF_B8_GRAY_l_C = 1783;
var XF_B8_GRAY_l_R = module.exports.XF_B8_GRAY_l_R = 1784;
var XF_B8_GRAY_lb_L = module.exports.XF_B8_GRAY_lb_L = 1785;
var XF_B8_GRAY_lb_C = module.exports.XF_B8_GRAY_lb_C = 1786;
var XF_B8_GRAY_lb_R = module.exports.XF_B8_GRAY_lb_R = 1787;
var XF_B8_GRAY_lB_L = module.exports.XF_B8_GRAY_lB_L = 1788;
var XF_B8_GRAY_lB_C = module.exports.XF_B8_GRAY_lB_C = 1789;
var XF_B8_GRAY_lB_R = module.exports.XF_B8_GRAY_lB_R = 1790;
var XF_B8_GRAY_lt_L = module.exports.XF_B8_GRAY_lt_L = 1791;
var XF_B8_GRAY_lt_C = module.exports.XF_B8_GRAY_lt_C = 1792;
var XF_B8_GRAY_lt_R = module.exports.XF_B8_GRAY_lt_R = 1793;
var XF_B8_GRAY_ltb_L = module.exports.XF_B8_GRAY_ltb_L = 1794;
var XF_B8_GRAY_ltb_C = module.exports.XF_B8_GRAY_ltb_C = 1795;
var XF_B8_GRAY_ltb_R = module.exports.XF_B8_GRAY_ltb_R = 1796;
var XF_B8_GRAY_ltB_L = module.exports.XF_B8_GRAY_ltB_L = 1797;
var XF_B8_GRAY_ltB_C = module.exports.XF_B8_GRAY_ltB_C = 1798;
var XF_B8_GRAY_ltB_R = module.exports.XF_B8_GRAY_ltB_R = 1799;
var XF_B8_GRAY_lT_L = module.exports.XF_B8_GRAY_lT_L = 1800;
var XF_B8_GRAY_lT_C = module.exports.XF_B8_GRAY_lT_C = 1801;
var XF_B8_GRAY_lT_R = module.exports.XF_B8_GRAY_lT_R = 1802;
var XF_B8_GRAY_lTb_L = module.exports.XF_B8_GRAY_lTb_L = 1803;
var XF_B8_GRAY_lTb_C = module.exports.XF_B8_GRAY_lTb_C = 1804;
var XF_B8_GRAY_lTb_R = module.exports.XF_B8_GRAY_lTb_R = 1805;
var XF_B8_GRAY_lTB_L = module.exports.XF_B8_GRAY_lTB_L = 1806;
var XF_B8_GRAY_lTB_C = module.exports.XF_B8_GRAY_lTB_C = 1807;
var XF_B8_GRAY_lTB_R = module.exports.XF_B8_GRAY_lTB_R = 1808;
var XF_B8_GRAY_lr_L = module.exports.XF_B8_GRAY_lr_L = 1809;
var XF_B8_GRAY_lr_C = module.exports.XF_B8_GRAY_lr_C = 1810;
var XF_B8_GRAY_lr_R = module.exports.XF_B8_GRAY_lr_R = 1811;
var XF_B8_GRAY_lrb_L = module.exports.XF_B8_GRAY_lrb_L = 1812;
var XF_B8_GRAY_lrb_C = module.exports.XF_B8_GRAY_lrb_C = 1813;
var XF_B8_GRAY_lrb_R = module.exports.XF_B8_GRAY_lrb_R = 1814;
var XF_B8_GRAY_lrB_L = module.exports.XF_B8_GRAY_lrB_L = 1815;
var XF_B8_GRAY_lrB_C = module.exports.XF_B8_GRAY_lrB_C = 1816;
var XF_B8_GRAY_lrB_R = module.exports.XF_B8_GRAY_lrB_R = 1817;
var XF_B8_GRAY_lrt_L = module.exports.XF_B8_GRAY_lrt_L = 1818;
var XF_B8_GRAY_lrt_C = module.exports.XF_B8_GRAY_lrt_C = 1819;
var XF_B8_GRAY_lrt_R = module.exports.XF_B8_GRAY_lrt_R = 1820;
var XF_B8_GRAY_lrtb_L = module.exports.XF_B8_GRAY_lrtb_L = 1821;
var XF_B8_GRAY_lrtb_C = module.exports.XF_B8_GRAY_lrtb_C = 1822;
var XF_B8_GRAY_lrtb_R = module.exports.XF_B8_GRAY_lrtb_R = 1823;
var XF_B8_GRAY_lrtB_L = module.exports.XF_B8_GRAY_lrtB_L = 1824;
var XF_B8_GRAY_lrtB_C = module.exports.XF_B8_GRAY_lrtB_C = 1825;
var XF_B8_GRAY_lrtB_R = module.exports.XF_B8_GRAY_lrtB_R = 1826;
var XF_B8_GRAY_lrT_L = module.exports.XF_B8_GRAY_lrT_L = 1827;
var XF_B8_GRAY_lrT_C = module.exports.XF_B8_GRAY_lrT_C = 1828;
var XF_B8_GRAY_lrT_R = module.exports.XF_B8_GRAY_lrT_R = 1829;
var XF_B8_GRAY_lrTb_L = module.exports.XF_B8_GRAY_lrTb_L = 1830;
var XF_B8_GRAY_lrTb_C = module.exports.XF_B8_GRAY_lrTb_C = 1831;
var XF_B8_GRAY_lrTb_R = module.exports.XF_B8_GRAY_lrTb_R = 1832;
var XF_B8_GRAY_lrTB_L = module.exports.XF_B8_GRAY_lrTB_L = 1833;
var XF_B8_GRAY_lrTB_C = module.exports.XF_B8_GRAY_lrTB_C = 1834;
var XF_B8_GRAY_lrTB_R = module.exports.XF_B8_GRAY_lrTB_R = 1835;
var XF_B8_GRAY_lR_L = module.exports.XF_B8_GRAY_lR_L = 1836;
var XF_B8_GRAY_lR_C = module.exports.XF_B8_GRAY_lR_C = 1837;
var XF_B8_GRAY_lR_R = module.exports.XF_B8_GRAY_lR_R = 1838;
var XF_B8_GRAY_lRb_L = module.exports.XF_B8_GRAY_lRb_L = 1839;
var XF_B8_GRAY_lRb_C = module.exports.XF_B8_GRAY_lRb_C = 1840;
var XF_B8_GRAY_lRb_R = module.exports.XF_B8_GRAY_lRb_R = 1841;
var XF_B8_GRAY_lRB_L = module.exports.XF_B8_GRAY_lRB_L = 1842;
var XF_B8_GRAY_lRB_C = module.exports.XF_B8_GRAY_lRB_C = 1843;
var XF_B8_GRAY_lRB_R = module.exports.XF_B8_GRAY_lRB_R = 1844;
var XF_B8_GRAY_lRt_L = module.exports.XF_B8_GRAY_lRt_L = 1845;
var XF_B8_GRAY_lRt_C = module.exports.XF_B8_GRAY_lRt_C = 1846;
var XF_B8_GRAY_lRt_R = module.exports.XF_B8_GRAY_lRt_R = 1847;
var XF_B8_GRAY_lRtb_L = module.exports.XF_B8_GRAY_lRtb_L = 1848;
var XF_B8_GRAY_lRtb_C = module.exports.XF_B8_GRAY_lRtb_C = 1849;
var XF_B8_GRAY_lRtb_R = module.exports.XF_B8_GRAY_lRtb_R = 1850;
var XF_B8_GRAY_lRtB_L = module.exports.XF_B8_GRAY_lRtB_L = 1851;
var XF_B8_GRAY_lRtB_C = module.exports.XF_B8_GRAY_lRtB_C = 1852;
var XF_B8_GRAY_lRtB_R = module.exports.XF_B8_GRAY_lRtB_R = 1853;
var XF_B8_GRAY_lRT_L = module.exports.XF_B8_GRAY_lRT_L = 1854;
var XF_B8_GRAY_lRT_C = module.exports.XF_B8_GRAY_lRT_C = 1855;
var XF_B8_GRAY_lRT_R = module.exports.XF_B8_GRAY_lRT_R = 1856;
var XF_B8_GRAY_lRTb_L = module.exports.XF_B8_GRAY_lRTb_L = 1857;
var XF_B8_GRAY_lRTb_C = module.exports.XF_B8_GRAY_lRTb_C = 1858;
var XF_B8_GRAY_lRTb_R = module.exports.XF_B8_GRAY_lRTb_R = 1859;
var XF_B8_GRAY_lRTB_L = module.exports.XF_B8_GRAY_lRTB_L = 1860;
var XF_B8_GRAY_lRTB_C = module.exports.XF_B8_GRAY_lRTB_C = 1861;
var XF_B8_GRAY_lRTB_R = module.exports.XF_B8_GRAY_lRTB_R = 1862;
var XF_B8_GRAY_L_L = module.exports.XF_B8_GRAY_L_L = 1863;
var XF_B8_GRAY_L_C = module.exports.XF_B8_GRAY_L_C = 1864;
var XF_B8_GRAY_L_R = module.exports.XF_B8_GRAY_L_R = 1865;
var XF_B8_GRAY_Lb_L = module.exports.XF_B8_GRAY_Lb_L = 1866;
var XF_B8_GRAY_Lb_C = module.exports.XF_B8_GRAY_Lb_C = 1867;
var XF_B8_GRAY_Lb_R = module.exports.XF_B8_GRAY_Lb_R = 1868;
var XF_B8_GRAY_LB_L = module.exports.XF_B8_GRAY_LB_L = 1869;
var XF_B8_GRAY_LB_C = module.exports.XF_B8_GRAY_LB_C = 1870;
var XF_B8_GRAY_LB_R = module.exports.XF_B8_GRAY_LB_R = 1871;
var XF_B8_GRAY_Lt_L = module.exports.XF_B8_GRAY_Lt_L = 1872;
var XF_B8_GRAY_Lt_C = module.exports.XF_B8_GRAY_Lt_C = 1873;
var XF_B8_GRAY_Lt_R = module.exports.XF_B8_GRAY_Lt_R = 1874;
var XF_B8_GRAY_Ltb_L = module.exports.XF_B8_GRAY_Ltb_L = 1875;
var XF_B8_GRAY_Ltb_C = module.exports.XF_B8_GRAY_Ltb_C = 1876;
var XF_B8_GRAY_Ltb_R = module.exports.XF_B8_GRAY_Ltb_R = 1877;
var XF_B8_GRAY_LtB_L = module.exports.XF_B8_GRAY_LtB_L = 1878;
var XF_B8_GRAY_LtB_C = module.exports.XF_B8_GRAY_LtB_C = 1879;
var XF_B8_GRAY_LtB_R = module.exports.XF_B8_GRAY_LtB_R = 1880;
var XF_B8_GRAY_LT_L = module.exports.XF_B8_GRAY_LT_L = 1881;
var XF_B8_GRAY_LT_C = module.exports.XF_B8_GRAY_LT_C = 1882;
var XF_B8_GRAY_LT_R = module.exports.XF_B8_GRAY_LT_R = 1883;
var XF_B8_GRAY_LTb_L = module.exports.XF_B8_GRAY_LTb_L = 1884;
var XF_B8_GRAY_LTb_C = module.exports.XF_B8_GRAY_LTb_C = 1885;
var XF_B8_GRAY_LTb_R = module.exports.XF_B8_GRAY_LTb_R = 1886;
var XF_B8_GRAY_LTB_L = module.exports.XF_B8_GRAY_LTB_L = 1887;
var XF_B8_GRAY_LTB_C = module.exports.XF_B8_GRAY_LTB_C = 1888;
var XF_B8_GRAY_LTB_R = module.exports.XF_B8_GRAY_LTB_R = 1889;
var XF_B8_GRAY_Lr_L = module.exports.XF_B8_GRAY_Lr_L = 1890;
var XF_B8_GRAY_Lr_C = module.exports.XF_B8_GRAY_Lr_C = 1891;
var XF_B8_GRAY_Lr_R = module.exports.XF_B8_GRAY_Lr_R = 1892;
var XF_B8_GRAY_Lrb_L = module.exports.XF_B8_GRAY_Lrb_L = 1893;
var XF_B8_GRAY_Lrb_C = module.exports.XF_B8_GRAY_Lrb_C = 1894;
var XF_B8_GRAY_Lrb_R = module.exports.XF_B8_GRAY_Lrb_R = 1895;
var XF_B8_GRAY_LrB_L = module.exports.XF_B8_GRAY_LrB_L = 1896;
var XF_B8_GRAY_LrB_C = module.exports.XF_B8_GRAY_LrB_C = 1897;
var XF_B8_GRAY_LrB_R = module.exports.XF_B8_GRAY_LrB_R = 1898;
var XF_B8_GRAY_Lrt_L = module.exports.XF_B8_GRAY_Lrt_L = 1899;
var XF_B8_GRAY_Lrt_C = module.exports.XF_B8_GRAY_Lrt_C = 1900;
var XF_B8_GRAY_Lrt_R = module.exports.XF_B8_GRAY_Lrt_R = 1901;
var XF_B8_GRAY_Lrtb_L = module.exports.XF_B8_GRAY_Lrtb_L = 1902;
var XF_B8_GRAY_Lrtb_C = module.exports.XF_B8_GRAY_Lrtb_C = 1903;
var XF_B8_GRAY_Lrtb_R = module.exports.XF_B8_GRAY_Lrtb_R = 1904;
var XF_B8_GRAY_LrtB_L = module.exports.XF_B8_GRAY_LrtB_L = 1905;
var XF_B8_GRAY_LrtB_C = module.exports.XF_B8_GRAY_LrtB_C = 1906;
var XF_B8_GRAY_LrtB_R = module.exports.XF_B8_GRAY_LrtB_R = 1907;
var XF_B8_GRAY_LrT_L = module.exports.XF_B8_GRAY_LrT_L = 1908;
var XF_B8_GRAY_LrT_C = module.exports.XF_B8_GRAY_LrT_C = 1909;
var XF_B8_GRAY_LrT_R = module.exports.XF_B8_GRAY_LrT_R = 1910;
var XF_B8_GRAY_LrTb_L = module.exports.XF_B8_GRAY_LrTb_L = 1911;
var XF_B8_GRAY_LrTb_C = module.exports.XF_B8_GRAY_LrTb_C = 1912;
var XF_B8_GRAY_LrTb_R = module.exports.XF_B8_GRAY_LrTb_R = 1913;
var XF_B8_GRAY_LrTB_L = module.exports.XF_B8_GRAY_LrTB_L = 1914;
var XF_B8_GRAY_LrTB_C = module.exports.XF_B8_GRAY_LrTB_C = 1915;
var XF_B8_GRAY_LrTB_R = module.exports.XF_B8_GRAY_LrTB_R = 1916;
var XF_B8_GRAY_LR_L = module.exports.XF_B8_GRAY_LR_L = 1917;
var XF_B8_GRAY_LR_C = module.exports.XF_B8_GRAY_LR_C = 1918;
var XF_B8_GRAY_LR_R = module.exports.XF_B8_GRAY_LR_R = 1919;
var XF_B8_GRAY_LRb_L = module.exports.XF_B8_GRAY_LRb_L = 1920;
var XF_B8_GRAY_LRb_C = module.exports.XF_B8_GRAY_LRb_C = 1921;
var XF_B8_GRAY_LRb_R = module.exports.XF_B8_GRAY_LRb_R = 1922;
var XF_B8_GRAY_LRB_L = module.exports.XF_B8_GRAY_LRB_L = 1923;
var XF_B8_GRAY_LRB_C = module.exports.XF_B8_GRAY_LRB_C = 1924;
var XF_B8_GRAY_LRB_R = module.exports.XF_B8_GRAY_LRB_R = 1925;
var XF_B8_GRAY_LRt_L = module.exports.XF_B8_GRAY_LRt_L = 1926;
var XF_B8_GRAY_LRt_C = module.exports.XF_B8_GRAY_LRt_C = 1927;
var XF_B8_GRAY_LRt_R = module.exports.XF_B8_GRAY_LRt_R = 1928;
var XF_B8_GRAY_LRtb_L = module.exports.XF_B8_GRAY_LRtb_L = 1929;
var XF_B8_GRAY_LRtb_C = module.exports.XF_B8_GRAY_LRtb_C = 1930;
var XF_B8_GRAY_LRtb_R = module.exports.XF_B8_GRAY_LRtb_R = 1931;
var XF_B8_GRAY_LRtB_L = module.exports.XF_B8_GRAY_LRtB_L = 1932;
var XF_B8_GRAY_LRtB_C = module.exports.XF_B8_GRAY_LRtB_C = 1933;
var XF_B8_GRAY_LRtB_R = module.exports.XF_B8_GRAY_LRtB_R = 1934;
var XF_B8_GRAY_LRT_L = module.exports.XF_B8_GRAY_LRT_L = 1935;
var XF_B8_GRAY_LRT_C = module.exports.XF_B8_GRAY_LRT_C = 1936;
var XF_B8_GRAY_LRT_R = module.exports.XF_B8_GRAY_LRT_R = 1937;
var XF_B8_GRAY_LRTb_L = module.exports.XF_B8_GRAY_LRTb_L = 1938;
var XF_B8_GRAY_LRTb_C = module.exports.XF_B8_GRAY_LRTb_C = 1939;
var XF_B8_GRAY_LRTb_R = module.exports.XF_B8_GRAY_LRTb_R = 1940;
var XF_B8_GRAY_LRTB_L = module.exports.XF_B8_GRAY_LRTB_L = 1941;
var XF_B8_GRAY_LRTB_C = module.exports.XF_B8_GRAY_LRTB_C = 1942;
var XF_B8_GRAY_LRTB_R = module.exports.XF_B8_GRAY_LRTB_R = 1943;
// end format constants }}}



function generate(file_name, children, config, report_date) {
    log.debug('Generating excel spreadsheet...');

    children = children.filter(function (child) {return child.line_num});
    children = children.sort(function (a, b) {
        return (a.claim_num*100 + a.line_num) - (b.claim_num*100 + b.line_num);
    });
    children.forEach(function (child) {
        child.first_date = null;
        child.last_date = null;
        child.hours = 0;
        child.days = 0;
    });

    var sheet_one = worksheet_one(children, report_date),
        sheet_two = worksheet_two(children, report_date),
        data = calculate_totals(children, report_date, config),
        sheet_three = worksheet_three(data.children),
        sheet_four = worksheet_four(data),
        sheet_five;

    try {
        XLSX.writeFile({
            SheetNames : ['1-15', '16-31', 'Summary', 'Totals', 'Notes'],
            Sheets : {
                '1-15' : sheet_one,
                '16-31' : sheet_two,
                'Summary' : sheet_three,
                'Totals' : sheet_four/*,
                'Notes' : worksheet_five()*/
            }
        }, file_name);
    } catch (error) {
        log.error(error);
        log.debug(error.stack);
        throw new Error('Error generating spreadsheet');
    }
    log.debug('Spreadsheet generated.');
}



function worksheet_one(children, report_date) {
    var ws = new title_xx.excel.worksheet(19);

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:14.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:6}, {wch:6}
    ];

    var child = children[0];
    for (var i = 1, j = 0; i < 100 && child; ++i) {
        build_header(ws, report_date, 1, 15);
        for (var k = 1; k < 5; ++k) {
            if (k > 1) build_spacer(ws, report_date, 1, 15);
            if (child && child.claim_num === i && child.line_num === k) {
                build_child(ws, report_date, 1, 15, child);
                child = ++j < children.length ? children[j] : null;
            } else {
                build_child(ws, report_date, 1, 15);
            }
        }
        build_footer(ws, report_date, 1, 15);
    }

    return ws.export();
}



function worksheet_two(children, report_date) {
    var ws = new title_xx.excel.worksheet(20),
        last_day = (new Date(
            report_date.getFullYear(), report_date.getMonth() + 1, 0
        )).getDate();

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:14}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5}, {wch:5.5},
        {wch:6}, {wch:6}
    ];

    var child = children[0];
    for (var i = 1, j = 0; i < 100 && child; ++i) {
        build_header(ws, report_date, 16, last_day);
        for (var k = 1; k < 5; ++k) {
            if (k > 1) build_spacer(ws, report_date, 16, last_day);
            if (child && child.claim_num === i && child.line_num === k) {
                build_child(ws, report_date, 16, last_day, child);
                child = ++j < children.length ? children[j] : null;
            } else {
                build_child(ws, report_date, 16, last_day);
            }
        }
        build_footer(ws, report_date, 16, last_day);
    }

    return ws.export();
}



function calculate_totals(children, report_date, config) {
    var data = {
            total_dollars : 0,
            total_hours : 0,
            total_days : 0,
            total_children : 0,
            rates : [
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0},
                {dollars : 0, hours : 0, days : 0, children : 0}
            ]
        },
        month_offset = report_date.getFullYear()*12 + report_date.getMonth()
            - (new Date()).getFullYear()*12 - (new Date()).getMonth();


    data.children = children.map(function (child) {
        var result = {
                claim_num : child.claim_num, line_num : child.line_num,
                name : child.name,
                from_date : child.from_date, to_date : child.to_date,
                fee : child.fee === 'yes' ? config.fee_amount : 0
            },
            age = child.age + month_offset,
            rate_unit, rate_index
                = age <= config.rate1_max_age ? 1
                : age <= config.rate2_max_age ? 2
                : age <= config.rate3_max_age ? 3 : 4;

        result.days = child.logical_days;
        result.daily_rate = config['rate' + rate_index + '_daily_rate'];
        result.daily_amount = result.days * result.daily_rate;
        data.total_days += result.days;
        data.total_dollars += result.daily_amount;
        data.rates[rate_index - 1].days += result.days;

        result.hours = child.logical_hours;
        result.hourly_rate = config['rate' + rate_index + '_hourly_rate'];
        result.hourly_amount = result.hours * result.hourly_rate;
        data.total_hours += result.hours;
        data.total_dollars += result.hourly_amount;
        data.rates[rate_index - 1].hours += result.hours;

        if (result.days + result.hours > 0.0) {
            ++data.total_children;
            ++data.rates[rate_index-1].children;
            data.rates[rate_index - 1].dollars
                += result.daily_amount + result.hourly_amount;
        }

        return result;
    });
        
    return data;
}



function worksheet_three(children) {
    var ws = new title_xx.excel.worksheet(13), prev_claim = -1;

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [
        {wch:4}, {wch:28}, {wch:8}, {wch:8}, {wch:4}, {wch:10}, {wch:10},
        {wch:4}, {wch:6}, {wch:4}, {wch:8}, {wch:6}, {wch:12}
    ];

    children.forEach(function (child) {
        // do header stuff for new claims
        if (child.claim_num !== prev_claim) {
            // if it's not the first claim, pad out the previous claim to 1 page
            if (prev_claim !== -1) {
                fmt_fill(ws, ws.rows, 0, 12, XF_T_L);
                ws.rows += 4;
            }
            prev_claim = child.claim_num;

            ws['!merges'] = ws['!merges'].concat([
                {s : {c : 0, r : ws.rows}, e : {c : 1, r : ws.rows}}
            ]);

            cell(ws, 0, ws.rows, 'Claim Number: ' + child.claim_num, XF_B10_TB_L);
            fmt_fill(ws, ws.rows, 1, 12, XF_TB_L);
            ++ws.rows;
            cell(ws, 0, ws.rows, 'Line', XF_B10_TB_L);
            cell(ws, 1, ws.rows, 'Child Name', XF_B10_TB_L);
            cell(ws, 2, ws.rows, 'Client #', XF_B10_TB_L);
            cell(ws, 3, ws.rows, 'Auth #', XF_B10_TB_L);
            cell(ws, 4, ws.rows, 'Svc', XF_B10_TB_L);
            cell(ws, 5, ws.rows, 'From Date', XF_B10_TB_L);
            cell(ws, 6, ws.rows, 'To Date', XF_B10_TB_L);
            cell(ws, 7, ws.rows, 'Freq', XF_B10_TB_L);
            cell(ws, 8, ws.rows, 'Units', XF_B10_TB_L);
            cell(ws, 9, ws.rows, 'Rate', XF_B10_TB_L);
            cell(ws, 10, ws.rows, 'Charge', XF_B10_TB_L);
            cell(ws, 11, ws.rows, 'Fee', XF_B10_TB_L);
            cell(ws, 12, ws.rows, 'HHS Charge', XF_B10_TB_L);
            ++ws.rows;
        }

        var comb = (1 * !!child.days) + (2 * !!child.hours),
            clf = XF_L, crf = XF_R, dlf = XF_L, drf = XF_R;
        if (comb === 1) {
            clf = dlf = XF_b_L;
            crf = drf = XF_b_R;
        } else if (comb === 2) {
            clf = XF_b_L;
            crf = XF_b_R;
        }
        cell(ws, 0, ws.rows, child.line_num, clf);
        cell(ws, 1, ws.rows, child.name, clf);
        cell(ws, 2, ws.rows, 0, clf);
        cell(ws, 3, ws.rows, 0, clf);
        cell(ws, 4, ws.rows, '', clf);
        if (child.from_date)
            cell(ws, 5, ws.rows, child.from_date.toLocaleDateString(), clf);
        if (child.to_date)
            cell(ws, 6, ws.rows, child.to_date.toLocaleDateString(), clf);
        if (comb === 3) fmt_fill(ws, ws.rows + 1, 0, 6, XF_b_L);
        if (comb & 1) {
            cell(ws, 7, ws.rows, 'DY', dlf);
            cell(ws, 8, ws.rows, child.days, drf);
            cell(ws, 9, ws.rows, child.daily_rate, drf);
            cell(ws, 10, ws.rows, dollars(child.daily_amount), drf);
            cell(ws, 11, ws.rows, child.fee, drf);
            cell(ws, 12, ws.rows, dollars(child.daily_amount + child.fee), drf);
            ++ws.rows;
        }
        if (comb & 2) {
            cell(ws, 7, ws.rows, 'HR', XF_b_L);
            cell(ws, 8, ws.rows, child.hours, XF_b_R);
            cell(ws, 9, ws.rows, child.hourly_rate, XF_b_R);
            cell(ws, 10, ws.rows, dollars(child.hourly_amount), XF_b_R);
            cell(ws, 11, ws.rows, child.fee, XF_b_R);
            cell(ws, 12, ws.rows, dollars(child.hourly_amount + child.fee), XF_b_R);
            ++ws.rows;
        }
        if (!comb) {
            fmt_fill(ws, ws.rows, 7, 12, XF_b_L);
            ++ws.rows;
        }
    });

    return ws.export();
}

function worksheet_four(data) {
    var ws = new title_xx.excel.worksheet(2);

    ws['!page'] = {
        margins : {left : 0.4, right : 0.4, top : 0.3, bottom : 0.3},
        landscape : true
    };
    ws['!cols'] = [{wch:16}, {wch:16}];

    cell(ws, 0, ws.rows, 'Total Dollars', XF_T_L);
    cell(ws, 1, ws.rows, dollars(data.total_dollars), XF_T_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Hours');
    cell(ws, 1, ws.rows, round(data.total_hours), XF_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Days');
    cell(ws, 1, ws.rows, round(data.total_days), XF_R);
    ++ws.rows;
    cell(ws, 0, ws.rows, 'Total Children', XF_B_L);
    cell(ws, 1, ws.rows, round(data.total_children), XF_B_R);
    ++ws.rows;

    for (var i = 0; i < 4; ++i) {
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Dollars');
        cell(ws, 1, ws.rows, dollars(data.rates[i].dollars), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Hours');
        cell(ws, 1, ws.rows, round(data.rates[i].hours), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Days');
        cell(ws, 1, ws.rows, round(data.rates[i].days), XF_R);
        ++ws.rows;
        cell(ws, 0, ws.rows, 'Rate ' + (i + 1) + ' Children', XF_b_L);
        cell(ws, 1, ws.rows, round(data.rates[i].children), XF_b_R);
        ++ws.rows;
    }

    fmt_fill(ws, ws.rows, 0, 1, XF_T_L);


    return ws.export();
}



function fmt_fill(ws, row, curcol, endcol, format) {
    for (; curcol <= endcol; ++curcol) cell(ws, curcol, row, '', format);
}
function build_header(ws, report_date, first_day, last_day) {
    var offset = ws.cols - 19,
        range = offset
            ? '16th through the ' + last_day + (last_day === 31 ? 'st' : 'th')
            : '1st through the 15th';

    var rows = ws.rows;
    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 1, r : rows}, e : {c : 8, r : rows}}, 
        {s : {c : 10, r : rows}, e : {c : 17, r : rows}}, 

        {s : {c : 0, r : rows + 3}, e : {c : 6, r : rows + 3}}, 
        {s : {c : 7, r : rows + 3}, e : {c : 13, r : rows + 3}}, 
        {s : {c : 14, r : rows + 3}, e : {c : 17, r : rows + 3}}, 

        {s : {c : 1, r : rows + 5}, e : {c : 3, r : rows + 5}}, 
        {s : {c : 9, r : rows + 5}, e : {c : 10, r : rows + 5}}, 
        {s : {c : 16, r : rows + 5}, e : {c : 17, r : rows + 5}}
    ]);


    cell(ws, 1, rows, 'CHILD CARE CENTER ATTENDANCE CALENDAR', XF_B10_b_L);
    fmt_fill(ws, rows, 2, 8, XF_B10_b_L);
    cell(ws, 10, rows, 'NEBRASKA HEALTH AND HUMAN SERVICES SYSTEM', XF_B10_b_L);
    fmt_fill(ws, rows, 11, 17, XF_B10_b_L);

    cell(ws, 0, rows + 3, 'Center:  Happy Faces Child Development Center, LLC');
    cell(ws, 7, rows + 3, 'Address:  2402 N Street, Omaha, NE, 68107');
    cell(ws, 14, rows + 3, 'Phone:  (402) 884-2402');

    cell(ws, 0, rows + 5, 'Prepared By:');
    cell(ws, 1, rows + 5, title_xx.config.prepared_by, XF_b_L);
    fmt_fill(ws, rows + 5, 2, 3, XF_b_L);
    cell(ws, 7, rows + 5, 'Date prepared:');
    cell(ws, 9, rows + 5, (new Date()).toLocaleDateString(), XF_b_L);
    fmt_fill(ws, rows + 5, 10, 10, XF_b_L);
    cell(ws, 14, rows + 5, 'Mo/Year:');
    var rep_date = months[report_date.getMonth()] + ' ' + report_date.getDate();
    cell(ws, 16, rows + 5, rep_date, XF_b_L);
    fmt_fill(ws, rows + 5, 17, 17, XF_b_L);

    cell(ws, 0, rows + 7, 'Attendance by days, the ' + range, XF_B10_L);

    cell(ws, 0, rows + 8, "Child's Name", XF_LTB_L);
    cell(ws, 1, rows + 8, '', XF_RTB_L);

    for (var c = 2, day = first_day; day <= last_day; ++c, ++day)
        cell(ws, c, rows + 8, '' + day, XF_B10_rTB_C);
    cell(ws, c++, rows + 8, 'TOTAL', XF_B10_LRTB_C);
    cell(ws, c++, rows + 8, 'TOTAL', XF_B10_LRTB_C);


    ws.rows += 9;
}


function build_spacer(ws, report_date, first_day, last_day) {
    for (var i = 0, length = last_day - first_day + 5; i < length; ++i)
        cell(ws, i, ws.rows, '', XF_B10_GRAY_T_L);
    ++ws.rows;
}


function build_child(ws, report_date, first_day, last_day, child) {
    child = child || {name : ' ,  ', punches : [], line_num : ''};

    var rows = ws.rows,
        name = child.name.split(', ', 2),
        punches = new Array(last_day - first_day + 1),
        total_hours = 0, total_days = 0;
    punches.fill(null);

    child.punches
        .filter(function (punch) {
            var date = new Date(punch.time_in);
            return date.getMonth() === report_date.getMonth()
                && date.getFullYear() === report_date.getFullYear()
                && date.getDate() - first_day < punches.length
                && date.getDate() >= first_day;
        })
        .forEach(function (punch) {
            var date = new Date(punch.time_in),
                i = date.getDate() - first_day;
            if (!punches[i]) punches[i] = {punches : [], hours : 0};
            if (punches[i].punches.length < 4) {
                punches[i].punches.push(getHHMM(punch.time_in));
                punches[i].punches.push(getHHMM(punch.time_out));
                punches[i].hours += punch.time_out - punch.time_in;
            }
            // store some child data for use in calculating totals
            if (!child.from_date) child.from_date = date;
            child.to_date = date;
        });
    if (first_day === 1) {
        child.logical_hours = 0;
        child.logical_days = 0;
    }


    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows + 4}, e : {c : 1, r : rows + 4}},
        {s : {c : 0, r : rows + 5}, e : {c : 1, r : rows + 5}}
    ]);

    cell(ws, 0, rows, child.line_num, XF_LT_L);
    cell(ws, 0, rows + 2, name[0], XF_L_L);
    cell(ws, 0, rows + 1, name.pop(), XF_L_L);
    cell(ws, 0, rows + 3, '', XF_L_L);
    cell(ws, 0, rows + 4, 'Total number of hours per day', XF_8_LTb_R);
    cell(ws, 1, rows + 4, '', XF_8_RTb_L);
    cell(ws, 0, rows + 5, 'Transportation trips', XF_8_LtB_R);
    cell(ws, 1, rows + 5, '', XF_8_RtB_L);

    cell(ws, 1, rows, 'IN', XF_RT_R);
    cell(ws, 1, rows + 1, 'OUT', XF_R_R);
    cell(ws, 1, rows + 2, 'IN', XF_R_R);
    cell(ws, 1, rows + 3, 'OUT', XF_R_R);


    punches.forEach(function (punch, i) {
        var hours = 0, days = 0, punches,
            time, int, frac;
        if (punch) {
            punches = [].slice.call(punch.punches);
            cell(ws, i + 2, rows, punches.shift() || '', XF_rTb_C);
            cell(ws, i + 2, rows + 1, punches.shift() || '', XF_rb_C);
            cell(ws, i + 2, rows + 2, punches.shift() || '', XF_rb_C);
            cell(ws, i + 2, rows + 3, punches.shift() || '', XF_rb_C);
            hours = punch.hours / 1000 / 60 / 60;
            int = Math.trunc(hours);
            frac = hours - int;
            // round up to the nearest quarter hour
            frac = frac === 0.0 ? 0.0 : frac <= 0.25 ? 0.25
                : frac <= 0.5 ? 0.5 : frac <= 0.75 ? 0.75 : 1;
            // 6+ hours is a day
            if (int + frac >= 6.0) {
                ++total_days;
                ++child.logical_days;
            } else {
                total_hours += hours;
                child.logical_hours += int + frac;
            }
        } else {
            cell(ws, i + 2, rows, '', XF_rTb_L);
            cell(ws, i + 2, rows + 1, '', XF_rb_L);
            cell(ws, i + 2, rows + 2, '', XF_rb_L);
            cell(ws, i + 2, rows + 3, '', XF_rb_L);
        }
        cell(ws, i + 2, rows + 4, getHHMM(hours * 1000 * 60 * 60), XF_rTb_C);
        cell(ws, i + 2, rows + 5, 0, XF_rB_C);
    });


    cell(ws, punches.length + 2, rows, 'Hours', XF_LrTb_C);
    cell(ws, punches.length + 2, rows + 1, '', XF_L_L);
    cell(ws, punches.length + 2, rows + 2, '', XF_L_L);
    cell(ws, punches.length + 2, rows + 3, '', XF_LB_L);
    cell(ws, punches.length + 2, rows + 4, round(total_hours), XF_LTb_C);
    cell(ws, punches.length + 2, rows + 5, 0, XF_LtB_C);

    cell(ws, punches.length + 3, rows, 'Days', XF_lRTb_C);
    cell(ws, punches.length + 3, rows + 1, '', XF_R_L);
    cell(ws, punches.length + 3, rows + 2, '', XF_R_L);
    cell(ws, punches.length + 3, rows + 3, '', XF_RB_L);
    cell(ws, punches.length + 3, rows + 4, total_days, XF_lRTb_C);
    cell(ws, punches.length + 3, rows + 5, 0, XF_lRtB_C);


    ws.rows += 6;
}


function build_footer(ws, report_date, first_day, last_day) {
    var rows =  ws.rows, columns = last_day - first_day + 4;

    ws['!merges'] = ws['!merges'].concat([
        {s : {c : 0, r : rows + 2}, e : {c : 1, r : rows + 2}},
        {s : {c : 2, r : rows + 2}, e : {c : 8, r : rows + 2}},
        {s : {c : 12, r : rows + 2}, e : {c : 13, r : rows + 2}},
        {s : {c : 0, r : rows + 4}, e : {c : columns, r : rows + 4}},
        {s : {c : 0, r : rows + 5}, e : {c : columns, r : rows + 5}},
        {s : {c : 0, r : rows + 6}, e : {c : columns, r : rows + 6}},
        {s : {c : 13, r : rows + 7}, e : {c : 15, r : rows + 7}}
    ]);

    cell(ws, 0, rows + 2, "Provider's signature:");
    fmt_fill(ws, rows + 2, 2, 8, XF_b_L);
    cell(ws, 11, rows + 2, 'Date:');
    cell(ws, 12, rows + 2, (new Date()).toLocaleDateString(), XF_b_L);
    fmt_fill(ws, rows + 2, 13, 13, XF_b_L);

    cell(ws, 0, rows + 4, 'The exact number of hours (to the quarter-hour) of care provided must be indicated for each day you provide care.');
    cell(ws, 0, rows + 5, 'Submit the original to the local office and retain the copy for your records.');
    cell(ws, 0, rows + 6, 'Report only time that the child is actually in attendance.');

    cell(ws, 12, rows + 7, 'CC-19', XF_B10_C);
    cell(ws, 13, rows + 7, '9/00 (56088) Page ' + ++build_footer.page, XF_R);

    ws.rows += 8;
}
build_footer.page = 0;



// convenience
function cell(worksheet, col, row, contents, style) {
    worksheet[cc(col, row)] = sc(contents, style);
}

// cell coordinates
function cc(col, row) {return XLSX.utils.encode_cell({c : col, r : row})}

// string cell
function sc(string, style) {
    var result = {t : 's', v : string};
    if (style) result.raw_style = style;
    return result;
}

// get time as \d?\d:\d\d
function getHHMM(timestamp) {
    var minutes = Math.round(timestamp / 1000 / 60),
        hours = Math.floor(minutes / 60);
    minutes = minutes % 60; hours = hours % 24;
    return hours + ':' + (minutes < 10 ? '0' : '') + minutes;
}

// round to hundredths
function round(num) {
    return Math.round(num * 100) / 100;
}
// get string representation with exactly two decimal digits
function dollars(num) {
    var parts = ('' + round(num)).split('.');
    if (parts.length === 1) parts.push('00');
    else if (parts[1].length === 1) parts[1] += '0';
    return parts.join('.');
}



module.exports.generate = generate;
module.exports.worksheet = require('./worksheet.js');
