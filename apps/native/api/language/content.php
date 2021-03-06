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
	$lang_name = fetch_or_get($_POST['lang_name'], 0);
    $languages = array("english", "french", "german", "italian", "russian", "portuguese", "spanish", "turkish", "dutch", "ukraine");

	if (not_empty($lang_name) && in_array($lang_name, $languages)) {
        $data["code"]    = 200;
        $data["valid"]   = true;
        $data["message"] = "Language changed successfully";
        $data["data"]    = array();

		cl_update_user_data($me['id'], array(
            'language' => $lang_name
        ));
	}
	else {
		$data['code']     = 400;
        $data['err_code'] = "invalid_request_data";
        $data['message']  = "Display language name is invalid or missing";
    	$data['data']     = array();
	}
}