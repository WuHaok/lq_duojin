$.confirm = function(text, title, onCancel_text, onOK_text, onOK, onCancel) {
    var config;
    if (typeof text === 'object') {
        config = text
    } else {
        if (typeof title === 'function') {
            onCancel = arguments[2];
            onOK = arguments[1];
            title = undefined;
        }
        config = {
            text: text,
            title: title,
            onOK: onOK,
            onCancel: onCancel
        }
    }
    buttonCancel = onCancel_text != '' &&  onCancel_text != undefined ? onCancel_text : '取消'
    buttonOK = onOK_text != ''&&  onOK_text != undefined  ? onOK_text : '确定'
    return $.modal({
        text: config.text,
        title: config.title,
        buttons: [{
            text: buttonCancel,
            className: "default",
            onClick: config.onCancel
        }, {
            text: buttonOK,
            className: "primary",
            onClick: config.onOK
        }]
    });
};
