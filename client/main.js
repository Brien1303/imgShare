import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'meteor/jkuester:blaze-bs4'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css' // this is the default BS theme as example
import popper from 'popper.js'
global.Popper = popper // fixes some issues with Popper and Meteor

import './main.html';
import '../lib/collection.js';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

Template.myGallery.helpers({
  allImages(){
  	var prevTime = new Date().getTime() - 15000;
  	var results = imagesdb.find({createdOn: {$gte: {prevTime}}}).count();
	if (results > 0)
		//sort according to time then ratings 
		return imagesdb.find({},{sort :{createdOn:-1, ratings: -1}});
	else
		return imagesdb.find({},{sort :{ratings :-1, createdOn: -1}});
	
  },
});

Template.myGallery.events({
   'click .js-delete'(event, instance) {
  // 	console.log("delete");
     var myId = this._id;
     $("#deleteId").val(myId);
     $("#confirmDeletion").modal("show");
     },
 
    'click .js-confirm' (event, instance){
    	var myId = $ ("#deleteId").val();
    	   $("#"+myId).fadeOut('slow', function(){
    	imagesdb.remove({_id:myId});
    	console.log(myId);
    });
    },
  
  	'click .js-edit' (event, instance){
  		console.log ("let's edit");
  		var myId = this._id;
  		$("#EditImageModal").modal("show");
  		$("#"+this._id);
  		console.log(this._id);
  		var eTitle = imagesdb.findOne({_id:myId}).title;
  		console.log("title is "+ eTitle);
  		$ ("#editTitle").val(eTitle);

  		var ePath = imagesdb.findOne({_id:myId}).path;
  		console.log("path is "+ ePath);
  		$ ("#editPath").val(ePath);

  		var eDescription = imagesdb.findOne({_id:myId}).desc;
  		console.log("description is "+ eDescription);
  		$ ("#editDescription").val(eDescription);

  		$(".editHolder").attr("src", ePath);

  		$("#editId").val(myId);
  	},
  	'click .rating'(event, instance){
  		var myId = this.picId;
        const value = $(event.target).val();
        console.log(value+ " : " +myId);
        imagesdb.update({_id: myId},
			{$set:{
				"ratings": value
				}	
			}
		);	
    }

});

	Template.addImage.events({
	 'click .js-addImage'(event, instance) {
  	console.log("added image");
  },
  'click .js-close'(event, instance) {
  	console.log("closing image");
  },
  
  'click .js-saving'(event, instance) {
  	var theTitle = $ ("#imgTitle") .val()
  	console.log("Saving Image with title: "+theTitle );

  	var thePath = $ ("#imgPath") .val()
  	console.log("Saving Image with path: "+thePath );

  	var theDescription = $ ("#imgDescription") .val()
  	console.log("Saving Image with description: "+theDescription );
  	imagesdb.insert({
		"path": thePath,
		"title": theTitle,
		"desc": theDescription,
		"createdOn": new Date().getTime()


	});
  		console.log ("saving...");
				$("#js-addImageModal").modal("hide");
				$("#imgTitle").val("");
				$("#imgPath").val("");
				$("#imgDescription").val("");

		},

		'input #imgPath'(event, instance){
			$(".mountains").attr ("src", $ ("#imgPath") .val());
			console.log($("#imgPath").val());
		}

});
 
 Template.editImage.events({
 	'click .js-updatingImage'(event, instance){
		var newPath= $("#editPath").val();
		var newTitle= $("#editTitle").val();
		var newDescription= $("#editDescription").val();
		var editId = $("#editId").val();
		imagesdb.update({_id:editId},
			{$set:{
				"title": newTitle,
				"path": newPath,
				"desc": newDescription
			}
		});
	},
		// console.log("updating "+updateId+" Image with title:"+newTitle+" and its path is"+newPath+" and its description is"+newDescription);
		'input #editPath'(event, instance){
			$(".editHolder").attr ("src", $ ("#editPath") .val());
			console.log($("#editPath").val());
		}
 });

