/*
@*************************************************************************@
@ @author Mansur Altamirov (Mansur_TL)									  @
@ @author_url 1: https://www.instagram.com/mansur_tl                      @
@ @author_url 2: http://codecanyon.net/user/mansur_tl                     @
@ @author_email: highexpresstore@gmail.com                                @
@*************************************************************************@
@ ColibriSM - The Ultimate Modern Social Media Sharing Platform           @
@ Copyright (c) 21.03.2020 ColibriSM. All rights reserved.                @
@*************************************************************************@
 */

SELECT l.`id` AS offset_id, u.`id`, u.`about`, u.`followers`, u.`posts`, u.`avatar`, u.`last_active`, u.`username`, u.`fname`, u.`lname`, u.`email`, u.`verified`, u.`follow_privacy` FROM `<?php echo($data['t_likes']); ?>` l
	
	INNER JOIN `<?php echo($data['t_users']); ?>` u ON l.`user_id` = u.`id`

	WHERE l.`pub_id` = "<?php echo($data['post_id']); ?>"

	AND u.`active` IN ('1', '2')

	<?php if(not_empty($data['offset'])): ?>
		AND l.`id` < <?php echo($data['offset']); ?>
	<?php endif; ?>

	ORDER BY l.`id` DESC, u.`followers` DESC, u.`posts` DESC

<?php if(not_empty($data['limit'])): ?>
	LIMIT <?php echo($data['limit']); ?>;
<?php endif; ?>