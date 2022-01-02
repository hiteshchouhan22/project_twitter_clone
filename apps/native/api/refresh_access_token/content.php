<?php 
# @*************************************************************************@
# @ @author Mansur Altamirov (Mansur_TL)									@
# @ @author_url 1: https://www.instagram.com/mansur_tl                      @
# @ @author_url 2: http://codecanyon.net/user/mansur_tl                     @
# @ @author_email: highexpresstore@gmail.com                                @
# @*************************************************************************@
# @ ColibriSM - The Ultimate Modern Social Media Sharing Platform           @
# @ Copyright (c) 21.03.2020 ColibriSM. All rights reserved.                @
# @*************************************************************************@

$data['err_code'] = 0;
$token            = fetch_or_get($_POST['refresh_token'], null);

if (empty($token) || len_between($token, 50, 250) != true) {
	$data['err_code'] = 'invalid_token';
	$data['code']     = 400;
	$data['message']  = "Incorrect token value";
	$data['data']     = array();
}

else {
	$refresh_token = cl_text_secure($token);
	$user_data     = cl_db_get_item(T_USERS, array("refresh_token" => $refresh_token));

	if (empty($user_data) || $user_data["active"] != "1") {
		$data['err_code'] = 'invalid_token';
		$data['code']     = 400;
		$data['message']  = "Invalid token value or user account disabled";
		$data['data']     = array();
	}
	else {

		cl_db_delete_item(T_SESSIONS, array(
			"user_id"  => $user_data["id"],
			"platform" => "mobile_android"
		));

		cl_db_delete_item(T_SESSIONS, array(
			"user_id"  => $user_data["id"],
			"platform" => "mobile_ios"
		));

		$data['err_code'] = '0';
		$data['code']     = 200;
		$data['message']  = "Token refreshed Out successful";
		$data_exp         = strtotime("+ 1 year");
		$session_id       = cl_create_user_session($user_data["id"], "mobile_android");
		$refresh_token    = md5(rand(11111, 99999)) . time() . md5(microtime() . $user_data["id"]);
		$data['data']     = array(
			"auth_token"        => $session_id,
            "refresh_token"     => $refresh_token,
        	"auth_token_expiry" => $data_exp,
		);

		cl_update_user_data($user_data["id"], array(
			"refresh_token" => $refresh_token
		));
	}
}