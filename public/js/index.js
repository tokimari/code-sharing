require({
	baseUrl: '',
	paths: {
		'ace': 'js/lib/ace/ace'
	}
});


define(['ace'], function (ace) {
	var socket = io.connect(location.origin);
	var editor;
	var hash = location.hash;
	var init = function () {
		// get ace object from global
		ace = window.ace;

		// set editor
		editor = ace.edit("editor");
		// editor setting
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/javascript");

		// for debug
		editor.setReadOnly(true);
		if (hash === '#master-note') {
			window.editor = editor;
			editor.setReadOnly(false);
			document.onkeyup = function(e) {
				var code = editor.getValue();
				socket.emit('setValue', {
					value: code
				});
			};
		}
	};

	socket.on('setValue', function (data) {
		editor.setValue(data.value);
		var anc = editor.selection.getSelectionAnchor();
		//editor.selection.setSelectionAnchor(anc.row, anc.column);
		editor.selection.setSelectionRange({start: anc, end: anc});
	});


	setTimeout(init, 200);
});
