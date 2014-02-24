var _ = require('underscore');

module.exports = {
	serializeObject: function (array) {
		var object = {};
		_.each(array, function (item) {
			if (object[item.name] !== undefined) {
				if (!object[item.name].push) {
					object[item.name] = [object[item.name]];
				}
				object[item.name].push(item.value || '');
			} else {
				object[item.name] = item.value || '';
			}
		});
		return object;
	}
};
