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

SELECT posts.`id` as offset_id, posts.`publication_id`, posts.`type`, posts.`user_id` FROM `<?php echo($data['t_posts']); ?>` posts
	
	INNER JOIN `<?php echo($data['t_pubs']); ?>` pubs ON posts.`publication_id` = pubs.`id`

	WHERE pubs.`status` = 'active'

	AND (posts.`user_id` = <?php echo($data['user_id']); ?> OR posts.`user_id` IN (SELECT `following_id` FROM `<?php echo($data['t_conns']); ?>` WHERE `follower_id` = <?php echo($data['user_id']); ?> AND `status` = "active"))

	<?php if($data['offset']): ?>
		AND posts.`id` < <?php echo($data['offset']); ?>
	<?php endif; ?>

	ORDER BY posts.`id` DESC, pubs.`likes_count` DESC, pubs.`replys_count` DESC, pubs.`reposts_count` DESC

<?php if($data['limit']): ?>
	LIMIT <?php echo($data['limit']); ?>
<?php endif; ?>