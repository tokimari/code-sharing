require({
	baseUrl: '',
	paths: {
		'ace': 'js/ace/ace'
	}
});


define(['ace'], function (ace) {
	var socket = io.connect(location.origin);
	var editor;
	var init = function () {
		// get ace object from global
		ace = window.ace;

		// set editor
		editor = ace.edit("editor");
		// editor setting
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/javascript");

		// for debug
		window.editor = editor;

		document.onkeyup = function(e) {
			var code = editor.getValue();
			socket.emit('setValue', {
				value: code
			});
		};

	};

	socket.on('setValue', function (data) {
		editor.setValue(data.value);
	});


	setTimeout(init, 200);
});
