/* @*************************************************************************@
// @ @author Mansur Altamirov (Mansur_TL)									 @
// @ @author_url 1: https://www.instagram.com/mansur_tl                      @
// @ @author_url 2: http://codecanyon.net/user/mansur_tl                     @
// @ @author_email: highexpresstore@gmail.com                                @
// @*************************************************************************@
// @ ColibriSM - The Ultimate Modern Social Media Sharing Platform           @
// @ Copyright (c) 21.03.2020 ColibriSM. All rights reserved.                @
// @*************************************************************************@
*/

var pubbox_form_app_mixin = Object({
	data: function() {
		return {
			text: "",
			images: [],
			video: {},
			poll: [],
			gifs_r1: [],
			gifs_r2: [],
			image_ctrl: true,
			video_ctrl: true,
			poll_ctrl: true,
			gif_ctrl: true,
			submitting: false,
			active_media: null,
			gif_source: null,
			post_privacy: "everyone",
			og_imported: false,
			og_data: {},
			og_hidden: [],
			settings: {
				max_length: "<?php echo fetch_or_get($cl['config']['max_post_len'], 600); ?>"
			},
			sdds: {
				privacy: {
					everyone: "<?php echo cl_translate('Everyone can reply'); ?>",
					mentioned: "<?php echo cl_translate('Only mentioned people'); ?>",
					followers: "<?php echo cl_translate('Only my followers'); ?>",
				}
			},
			data_temp: {
				poll: {
					title: "<?php echo cl_translate('Option - '); ?>",
					value: ""
				}
			}
		};
	},
	computed: {
		valid_form: function() {
			var _app_ = this;

			if (_app_.active_media == 'image') {
				if (_app_.images.length >= 1 && cl_empty(_app_.submitting)) {
					return true;
				}
				else {
					return false;
				}
			}

			else if(_app_.active_media == 'gifs') {
				if(cl_empty(_app_.gif_source) != true && cl_empty(_app_.submitting)) {
					return true;
				}

				else {
					return false;
				}
			}

			else if(_app_.active_media == 'video') {
				if($.isEmptyObject(_app_.video) != true && cl_empty(_app_.submitting)) {
					return true;
				}

				else {
					return false;
				}
			}

			else if(_app_.active_media == 'poll') {
				if(_app_.text.length > 0 && _app_.valid_poll && cl_empty(_app_.submitting)) {
					return true;
				}

				else {
					return false;
				}
			}

			else if((_app_.active_media == null && _app_.text.length > 0) || _app_.og_imported) {
				return true;
			}

			else {
				return false;
			}
		},
		equal_height: function() {
			var app_el = $(this.$el);

			return "{0}px".format((app_el.innerWidth() / 4));
		},
		preview_video: function() {
			if ($.isEmptyObject(this.video)) {
				return false;
			}

			return true;
		},
		gifs: function() {
			if (this.gifs_r1.length || this.gifs_r2.length) {
				return true;
			}

			return false;
		},
		show_og_data: function() {
			if (this.og_imported == true && this.active_media == null && this.og_hidden.contains(this.og_data.url) != true) {
				return true;
			}
			else {
				return false;
			}
		},
		valid_poll: function() {
			var _app_ = this;

			if (cl_empty(_app_.poll.length)) {
				return false;
			}

			else {
				for (var i = 0; i < _app_.poll.length; i++) {
					if (cl_empty(_app_.poll[i].value)) {
						return false;
					}
				}

				return true;
			}
		}
	},
	methods: {
		emoji_picker: function(action = "toggle") {
			var app_el = $(this.$el);
			var _app_  = this;

			if (app_el.length) {
				if (action == "toggle") {
					if (app_el.find('textarea').get(0).emojioneArea.isOpened()) {
						app_el.find('textarea').get(0).emojioneArea.hidePicker();
					}
					
					else {
						app_el.find('textarea').get(0).emojioneArea.showPicker();
						_app_.rep_emoji_picker();
					}
				}

				else if(action == "open") {
					if (app_el.find('textarea').get(0).emojioneArea.isOpened() != true) {
						app_el.find('textarea').get(0).emojioneArea.showPicker();
						_app_.rep_emoji_picker();
					}
				}

				else if(action == "close") {
					if (app_el.find('textarea').get(0).emojioneArea.isOpened()) {
						app_el.find('textarea').get(0).emojioneArea.hidePicker();
					}
				}
			}
		},
		rep_emoji_picker: function() {
			var app_el = $(this.$el);
			app_el.find('div.emojionearea-picker').css("top", "{0}px".format(app_el.height() - 40));
		},
		textarea_resize: function(_self = null) {
			autosize($(_self.target));
		},
		publish: function(_self = null) {
			_self.preventDefault();

			var form         = $(_self.$el);
			var _app_        = this;
			var main_left_sb = $('div[data-app="left-sidebar"]');

			$(_self.target).ajaxSubmit({
				url: "<?php echo cl_link("native_api/main/publish_new_post"); ?>",
				type: 'POST',
				dataType: 'json',
				data: {
					gif_src: _app_.gif_source,
					thread_id: ((_app_.thread_id) ? _app_.thread_id : 0),
					curr_pn: SMColibri.curr_pn,
					og_data: _app_.og_data,
					privacy: _app_.post_privacy,
					poll_data: _app_.poll
				},
				beforeSend: function() {
					_app_.submitting = true;
				},
				success: function(data) {
					if (data.status == 200) {
						if (SMColibri.curr_pn == "home") {
							var home_timeline = $('div[data-app="homepage"]');
							var new_post      = $(data.html).addClass('animated fadeIn');

							if (home_timeline.find('div[data-an="entry-list"]').length) {
								home_timeline.find('div[data-an="entry-list"]').prepend(new_post).promise().done(function() {
									setTimeout(function() {
										home_timeline.find('div[data-an="entry-list"]').find('[data-list-item]').first().removeClass('animated fadeIn');
									}, 1000);
								});
							}
							else {
								SMColibri.spa_reload();
							}
						}
						else if(SMColibri.curr_pn == "thread" && _app_.thread_id) {
							_app_.thread_id     = 0;
							var thread_timeline = $('div[data-app="thread"]');
							var new_post        = $(data.html).addClass('animated fadeIn');

							if(thread_timeline.find('div[data-an="replys-list"]').length) {
								thread_timeline.find('div[data-an="replys-list"]').prepend(new_post).promise().done(function() {
									setTimeout(function() {
										thread_timeline.find('div[data-an="replys-list"]').find('[data-list-item]').first().removeClass('animated fadeIn');
									}, 1000);
								});
							}
							else {
								SMColibri.spa_reload();
							}

							thread_timeline.find('[data-an="pub-replys-total"]').text(data.replys_total);
						}
						else {
							cl_bs_notify("<?php echo cl_translate('Your new publication has been posted on your timeline'); ?>", 1200);
						}

						if($(_app_.$el).attr('id') == 'vue-pubbox-app-2') {
							$(_app_.$el).parents("div#add_new_post").modal('hide');
						}

						if (data.posts_total) {
							main_left_sb.find('b[data-an="total-posts"]').text(data.posts_total);
						}
					}

					else {
						_app_.submitting = false;
						SMColibri.errorMSG();
					}
				},
				complete: function() {
					_app_.submitting = false;
					_app_.reset_data();
				}
			});
		},
		create_poll: function() {
			var _app_ = this;

			if (cl_empty(_app_.active_media)) {
				if (_app_.poll_ctrl) {
					_app_.active_media = "poll";
					_app_.poll_option();
					_app_.poll_option();
					_app_.disable_ctrls();
				}
			}
		},
		poll_option: function() {
			var _app_ = this;

			if (_app_.poll.length < 4) {
				var poll_option_data = Object({
					title: _app_.data_temp.poll.title,
					value: _app_.data_temp.poll.value
				});

				_app_.poll.push(poll_option_data);
			}
			else{
				return false;
			}
		},
		cancel_poll: function() {
			var _app_          = this;
			_app_.active_media = null;
			_app_.poll         = [];

			_app_.disable_ctrls();
		},
		select_images: function() {
			var _app_ = this;

			if (_app_.active_media == 'image' || cl_empty(_app_.active_media)) {
				if (_app_.image_ctrl) {
					var app_el = $(_app_.$el);
					app_el.find('input[data-an="images-input"]').trigger('click');
				}
			}
		},
		select_video: function() {
			var _app_ = this;

			if (cl_empty(_app_.active_media)) {
				if (_app_.video_ctrl) {
					var app_el = $(_app_.$el);
					app_el.find('input[data-an="video-input"]').trigger('click');
				}
			}
		},
		select_gifs: function() {
			var _app_ = this;
			var step  = false;

			if (cl_empty(_app_.active_media)) {
				$.ajax({
					url: 'https://api.giphy.com/v1/gifs/trending',
					type: 'GET',
					dataType: 'json',
					data: {
						api_key: '{%config giphy_api_key%}',
						limit: 50,
						lang: cl_get_ulang(),
						fmt: 'json'
					},
				}).done(function(data) {
					if (data.meta.status == 200 && data.data.length > 0) {
						for (var i = 0; i < data.data.length; i++) {
							if (step) {
								_app_.gifs_r1.push({
									thumb: data['data'][i]['images']['preview_gif']['url'],
									src: data['data'][i]['images']['original']['url'],
								});
							}
							else {
								_app_.gifs_r2.push({
									thumb: data['data'][i]['images']['preview_gif']['url'],
									src: data['data'][i]['images']['original']['url'],
								});
							}

							step = !step;
						}
					}
				}).always(function() {
					if (_app_.gifs && cl_empty(_app_.active_media)) {
						_app_.active_media = "gifs";
					}

					_app_.disable_ctrls();
				});
			}
		},
		search_gifs: function(_self = null) {
			if (_self.target.value.length >= 2) {
				var query   = $.trim(_self.target.value);
				var step    = false;
				var _app_   = this;
				var gifs_r1 = _app_.gifs_r1;
				var gifs_r2 = _app_.gifs_r2;

				$.ajax({
					url: 'https://api.giphy.com/v1/gifs/search',
					type: 'GET',
					dataType: 'json',
					data: {
						q: query,
						api_key:'{%config giphy_api_key%}',
						limit: 50,
						lang:'en',
						fmt:'json'
					}
				}).done(function(data) {
					if (data.meta.status == 200 && data.data.length > 0) {
						_app_.gifs_r1 = [];
						_app_.gifs_r2 = [];

						for (var i = 0; i < data.data.length; i++) {
							if (step) {
								_app_.gifs_r1.push({
									thumb: data['data'][i]['images']['preview_gif']['url'],
									src: data['data'][i]['images']['original']['url'],
								});
							}
							else {
								_app_.gifs_r2.push({
									thumb: data['data'][i]['images']['preview_gif']['url'],
									src: data['data'][i]['images']['original']['url'],
								});
							}

							step = !step;
						}
					}
					else {
						_app_.gifs_r1 = gifs_r1;
						_app_.gifs_r2 = gifs_r2;
					}
				});
			}
		},
		preview_gif: function(_self = null) {
			var _app_ = this;

			if (_self.target) {
				_app_.gif_source = $(_self.target).data('source');
			}
		},
		rm_preview_gif: function() {
			var _app_ = this;

			_app_.gif_source = null;
		},
		close_gifs: function() {
			var _app_          = this;
			_app_.gifs_r1      = [];
			_app_.gifs_r2      = [];
			_app_.active_media = null;
			_app_.disable_ctrls();
		},
		rm_gif_preloader(_self = null) {
			if (_self.target) {
				$(_self.target).siblings('div').remove();
				$(_self.target).parent('div').removeClass('loading');
			}
		},
		upload_images: function(event = null) {
			var _app_  = this;
			var app_el = $(_app_.$el);

			if (cl_empty(_app_.active_media) || _app_.active_media == 'image') {
				var images = event.target.files;

				if (SMColibri.curr_pn == 'thread') {
	        		$('div[data-app="modal-pubbox"]').addClass('vis-hidden');
	        	}

				SMColibri.upload_progress_bar('show', "<?php echo cl_translate('Uploading images'); ?>");

				if (images.length) {
					for (var i = 0; i < images.length; i++) {
						var form_data  = new FormData();
						var break_loop = false;
						form_data.append('delay', 1);
						form_data.append('image', images[i]);
						form_data.append('hash', "<?php echo fetch_or_get($cl['csrf_token'],'none'); ?>");
						
						$.ajax({
							url: '<?php echo cl_link("native_api/main/upload_post_image"); ?>',
							type: 'POST',
							dataType: 'json',
							enctype: 'multipart/form-data',
							data: form_data,
							cache: false,
					        contentType: false,
					        processData: false,
					        timeout: 600000,
					        beforeSend: function() {
					        	_app_.submitting = true;
					        },
							success: function(data) {
								if (data.status == 200) {
									_app_.images.push(data.img);
								}
								else if(data.err_code == "total_limit_exceeded") {
									cl_bs_notify("<?php echo cl_translate('You cannot attach more than 10 images to this post.'); ?>",1500);
									break_loop = true;
								}
								else {
									cl_bs_notify("<?php echo cl_translate('An error occurred while processing your request. Please try again later.'); ?>",3000);
								}
							},
							complete: function() {
								if (_app_.images.length && cl_empty(_app_.active_media)) {
									_app_.active_media = "image";
								}

								_app_.disable_ctrls();

								_app_.submitting = false;
							}
						});

						if (break_loop) {break;}
					}
				}

				setTimeout(function() {
					SMColibri.upload_progress_bar('end');

					if (SMColibri.curr_pn == 'thread') {
		        		$('div[data-app="modal-pubbox"]').removeClass('vis-hidden');
		        	}
				}, 1500);

				app_el.find('input[data-an="images-input"]').val('');
			}
		},
		upload_video: function(event = null) {
			var _app_  = this;
			var app_el = $(_app_.$el);

			if (cl_empty(_app_.active_media)) {
				var video  = event.target.files[0];
				if (video) {
					var form_data = new FormData();
					form_data.append('video', video);
					form_data.append('hash', "<?php echo fetch_or_get($cl['csrf_token'],'none'); ?>");

					$.ajax({
						url: '<?php echo cl_link("native_api/main/upload_post_video"); ?>',
						type: 'POST',
						dataType: 'json',
						enctype: 'multipart/form-data',
						data: form_data,
						cache: false,
				        contentType: false,
				        processData: false,
				        timeout: 600000,
				        beforeSend: function() {
				        	SMColibri.upload_progress_bar('show', "<?php echo cl_translate('Uploading video'); ?>");

				        	if (SMColibri.curr_pn == 'thread') {
				        		$('div[data-app="modal-pubbox"]').addClass('vis-hidden');
				        	}
				        },
						success: function(data) {
							if (data.status == 200) {
								_app_.video = data.video;
							}
							else if(data.err_code == "total_limit_exceeded") {
								cl_bs_notify("<?php echo cl_translate('You cannot attach more than 1 video to this post.'); ?>",1500);
							}
							else {
								cl_bs_notify("<?php echo cl_translate('An error occurred while processing your request. Please try again later.'); ?>",3000);
							}
						},
						complete: function() {
							if ($.isEmptyObject(_app_.video) != true && cl_empty(_app_.active_media)) {
								_app_.active_media = "video";
							}

							_app_.disable_ctrls();
							app_el.find('input[data-an="video-input"]').val('');

							setTimeout(function() {
								SMColibri.upload_progress_bar('end');

								if (SMColibri.curr_pn == 'thread') {
					        		$('div[data-app="modal-pubbox"]').removeClass('vis-hidden');
					        	}
							}, 1500);
						}
					});
				}
			}
		},
		delete_image: function(id = null) {
			if (cl_empty(id)) {
				return false;
			}

			else {
				var _app_ = this;

				for (var i = 0; i < _app_.images.length; i++) {
					if (_app_.images[i]['id'] == id) {
						_app_.images.splice(i, 1);
					}
				}

				$.ajax({
					url: '<?php echo cl_link("native_api/main/delete_post_image"); ?>',
					type: 'POST',
					dataType: 'json',
					data: {image_id: id},
				}).done(function(data) {
					if (data.status != 200) {
						SMColibri.errorMSG();
					}
				}).always(function() {
					if (cl_empty(_app_.images.length)) {
						_app_.active_media = null;
					}

					_app_.disable_ctrls();
				});
			}
		},
		delete_video: function() {
			var _app_ = this;

			$.ajax({
				url: '<?php echo cl_link("native_api/main/delete_post_video"); ?>',
				type: 'POST',
				dataType: 'json',
			}).done(function(data) {
				if (data.status != 200) {
					SMColibri.errorMSG();
				}
				else {
					_app_.video = Object({});
				}
			}).always(function() {
				if ($.isEmptyObject(_app_.video)) {
					_app_.active_media = null;
				}

				_app_.disable_ctrls();
			});
		},
		disable_ctrls: function() {
			var _app_ = this;

			if (_app_.active_media == 'image' && _app_.images.length >= 10) {
				_app_.image_ctrl = false;
				_app_.gif_ctrl   = false;
				_app_.video_ctrl = false;
				_app_.poll_ctrl  = false;
			}
			else if(_app_.active_media == 'image' && _app_.images.length < 10) {
				_app_.image_ctrl = true;
				_app_.gif_ctrl   = false;
				_app_.video_ctrl = false;
				_app_.poll_ctrl  = false;
			}
			else if(_app_.active_media != null) {
				_app_.image_ctrl = false;
				_app_.gif_ctrl   = false;
				_app_.video_ctrl = false;
				_app_.poll_ctrl  = false;
			}
			else {
				_app_.image_ctrl = true;
				_app_.gif_ctrl   = true;
				_app_.video_ctrl = true;
				_app_.poll_ctrl  = true;
			}
		},
		reset_data: function() {
			var _app_          = this;
			_app_.image_ctrl   = true;
			_app_.gif_ctrl     = true;
			_app_.poll_ctrl    = true;
			_app_.video_ctrl   = true;
			_app_.og_imported  = false;
			_app_.text         = "";
			_app_.images       = [];
			_app_.video        = Object({});
			_app_.og_data      = Object({});
			_app_.poll         = [];
			_app_.active_media = null;
			_app_.gif_source   = null;
			_app_.gifs_r1      = [];
			_app_.gifs_r2      = [];
			_app_.og_hidden    = [];
			$(_app_.$el).find('textarea').get(0).emojioneArea.setText("");
			_app_.rep_emoji_picker();
		},
		rm_preview_og: function() {
			var _app_         = this;
			_app_.og_hidden.push(_app_.og_data.url);

			_app_.og_imported = false;
			_app_.og_data     = Object({});
		}
	},
	updated: function() {
		var _app_ = this;

		_app_.rep_emoji_picker();

		delay(function() {
			if (_app_.og_imported != true) {
				var text_links = _app_.text.match(/(https?:\/\/[^\s]+)/);

				if (text_links && text_links.length > 0 && _app_.og_hidden.contains(text_links[0]) != true) {
					$.ajax({
						url: '<?php echo cl_link("native_api/main/import_og_data"); ?>',
						type: 'POST',
						dataType: 'json',
						data: {
							url: text_links[0]
						}
					}).done(function(data) {
						if (data.status == 200) {
							_app_.og_imported = true;
							_app_.og_data     = data.og_data;
						}
					});
				}
			}
		}, 800);
	},
	mounted: function() {
		<?php if (not_empty($me['draft_post'])): ?>
			if ($(this.$el).attr('id') == 'vue-pubbox-app-1') {
				var app = this;
				delay(function() {
					$.ajax({
						url: '<?php echo cl_link("native_api/main/get_draft_post"); ?>',
						type: 'GET',
						dataType: 'json'
					}).done(function(data) {
						if (data.status == 200 && data.type == "image") {
							app.images       = data.images;
							app.active_media = 'image';
						}
						else if(data.status == 200 && data.type == "video") {
							app.video        = data.video;
							app.active_media = 'video';
						}
						else {
							return false;
						}

						if (data.status == 200) {
							cl_bs_notify("<?php echo cl_translate('Please finish editing the post or delete media files!'); ?>",3000);
						}
					}).always(function() {
						app.disable_ctrls();
					});
				}, 1500);
			}
		<?php endif; ?>
	}
});

var emoji_filters = Object({
	recent: {
		title: "<?php echo cl_translate("Recent"); ?>"
	},
	smileys_people: {
        title: "<?php echo cl_translate("Emoticons and People"); ?>",
    },
	animals_nature: {
        title: "<?php echo cl_translate("Animals & Nature"); ?>",
    },
	food_drink: {
        title: "<?php echo cl_translate("Food & Drink"); ?>",
    },
	activity: {
        title: "<?php echo cl_translate("Activity"); ?>",
    },
	travel_places: {
        title: "<?php echo cl_translate("Travel & Places"); ?>",
    },
	objects: {
        title: "<?php echo cl_translate("Objects"); ?>",
    },
	symbols: {
        title: "<?php echo cl_translate("Symbols"); ?>",
    },
	flags: {
        title: "<?php echo cl_translate("Flags"); ?>",
    }
});