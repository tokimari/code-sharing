require({
	baseUrl: '',
	paths: {
		'ace': 'js/lib/ace/ace'
	}
});


define(['ace'], function (ace) {
	var socket = io.connect(location.origin);
	var editor, token;
	var hash = location.hash;
	var init = function () {
		// get ace object from global
		ace = window.ace;

		// set editor
		editor = ace.edit("editor");
		// editor setting
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/javascript");

		// default setting read only
		editor.setReadOnly(true);

		if (hash === '#master-note') {
			var password = prompt('give me password.');
			socket.emit('getToken', password);
			socket.on('setToken', function(t) {
				if (t) {
					token = t;
				} else {
					location.href = 'https://yahoo.com';
				}
			});

			// for console debug
			window.editor = editor;

			// set writable
			editor.setReadOnly(false);

			document.onkeyup = function(e) {
				var code = editor.getValue();
				socket.emit('setValue', {
					value: code,
					token: token
				});
			};
		}

		// init data
		socket.emit('getValue');
	};

	socket.on('setValue', function (data) {
		var anc = editor.selection.getSelectionAnchor();
		editor.setValue(data.value);
		editor.selection.setSelectionAnchor(anc.row, anc.column);
		editor.selection.setSelectionRange({start: anc, end: anc});
	});


	setTimeout(init, 200);
});
