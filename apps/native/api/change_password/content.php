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

if (empty($cl['is_logged'])) {
	$data         = array(
		'code'    => 401,
		'data'    => array(),
		'message' => 'Unauthorized Access'
	);
}
else {
	$data['err_code']  = 0;
	$user_data_fileds  = array(
		'old_password' => fetch_or_get($_POST['old_password'], null),
        'new_password' => fetch_or_get($_POST['new_password'], null)
	);

	foreach ($user_data_fileds as $field_name => $field_val) {
		if ($field_name == 'old_password') {
			if (empty($field_val) || len_between($field_val, 6, 20) != true || password_verify($user_data_fileds["old_password"], $me["password"]) != true) {
	            $data['err_code'] = cl_strf("invalid_%s", $field_name);
	            $data['code']     = 402;
	        	$data['message']  = "Incorrect old password value";
	        	$data['data']     = array(); break;
	        }
		}

		else if ($field_name == 'new_password') {
			if (empty($field_val) || len_between($field_val, 6, 20) != true) {
	            $data['err_code'] = cl_strf("invalid_%s", $field_name);
	            $data['code']     = 402;
	        	$data['message']  = "Incorrect new password value";
	        	$data['data']     = array(); break;
	        }
		}
	}

	if (empty($data['err_code'])) {
		$data['code']    = 200;
        $data['message'] = "Password changed";
        $data['data']    = array();

        cl_update_user_data($me["id"], array(
        	"password" => password_hash($user_data_fileds["new_password"], PASSWORD_DEFAULT)
        ));
	}
}