import { Meteor } from 'meteor/meteor';
import '../lib/collection.js';

Meteor.startup(() => {
	// code to run on server at startup
	// var i;
	if (imagesdb.find().count()<1){
		for (i=1; i<26; i++){
			console.log("image"+i);
			imagesdb.insert({
				"path":"img_"+i+".jpg",
				"title":"title "+i,
				"desc":"description "+i,
				"createdOn": new Date().getTime()
			});
		}
	}
});
