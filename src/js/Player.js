"use strict";

var Player = {

//Private Data
_strength: {base 	: 5,
			level 	: 0,
			levels	: [1,2,4,6,10,14],
			cost	: [10,100,200,400,1000,"Maxed"]
			},
_speed:    {base	: 3.00,
			level 	: 0,
			levels	: [1,1.1,1.2,1.3,1.4],
			cost	: [30,300,500,900,"Maxed"]
			},
_magicCapacity: {base	: 60,
				 level	: 0,
				 levels	: [1,1.2,1.4,1.6,1.8,2],
				 cost 	: [10,100,200,400,1000,"Maxed"]
				},
_magicComsuption: {base 	: -0.06,
				   level 	: 0,
				   levels	: [1,0.9,0.85,0.8,0.75,0.7]
				   },
_magnetRadius: {base	: 30,
				level	: 0,
				levels	: [1,3,5,7,10],
				cost	: [20,200,400,800,"Maxed"]
				},
_luck: {base	: 1,
				level	: 0,
				levels	: [1,2,3,4,5,6],
				cost	: [6,60,120,240,480,"Maxed"]
				},
_piercing: {base : 1,
			level : 0,
			levels : [1,2,3,4],
			cost : [50,500,1000,"Maxed"]
			},

_snowBallCraft: {base : 46,
				level : 0,
				levels : [0,2,4,6,8,10],
				cost:	[10,100,200,400,1000,"Maxed"]
				},
_snowBallsCapacity: {base : 4,
					level : 0,
					levels : [0,2,4,6,8,10],
					cost:	[10,100,200,400,1000,"Maxed"]
					},
_snowBallMagicRadius: 	{base	:26,
						 level	: 0,
						 levels : [1,2,3,4,5],
						 cost : [20,200,400,1200,"Maxed"]
						},
_snowBallMagicDamage: 	{base	:0.1,
						 level	: 0,
						 levels : [1,2,3,4,5,6]
						},
_mojoBars: {base : 1,
			level : 0,
			levels : [1,2,3,],
			cost : [400,960,"Maxed"]
			},

_curGifts : 0,

_lastGifts: 0,
_lastKills: 0,
_lastDistance: 0,
_lastScore: 0,

_maxGifts : 0,
_maxDistance: 0,
_maxKills: 0,
_maxScore: 0,

_totalGifts: 0,
_totalDistance: 0,
_totalKills: 0,

deferredSetup: function(){
	$.ajax({
		'url': '/loginCheck',
		'type': 'get',
		'success': function(response){
			if(response){
				Player.loadFromServer();
			}else{
				Player.loadFromStorage()
			};
		}
	})

},

loadFromStorage: function(){
	this._allUpgrades = [this._strength, this._speed, this._magicCapacity, this._magnetRadius,
						 this._luck, this._piercing, this._snowBallCraft, this._snowBallMagicRadius]
	if(typeof(Storage) !== "undefined") {
		this._curGifts = parseInt(localStorage.curGifts,10) || 0;
		this._maxGifts = parseInt(localStorage.maxGifts,10) || 0;
		this._maxDistance = parseInt(localStorage.maxDistance,10) || 0;
		this._maxKills = parseInt(localStorage.maxKills, 10) || 0;
		this._maxScore = parseInt(localStorage.maxScore, 10) || 0;
		this._totalGifts = parseInt(localStorage.totalGifts, 10) || 0;
		this._totalDistance = parseInt(localStorage.totalDistance, 10) || 0;
		this._totalKills = parseInt(localStorage.totalKills, 10) || 0;
		for(var i = 0; i < this._allUpgrades.length; i++){
			this._allUpgrades[i].level = parseInt(localStorage[i],10) || 0;
		}
	} else {
		// Sorry! No Web Storage support..
	}
},

loadFromServer: function(){
	$.ajax({
		'url': '/loadGame',
		'type': 'get',
		'success': function(response){
			let data = response[0].savegame;
			if(data) {
				Player.loadingFromServer(data);
			} else {
				Player.initializeAttr();
			}
		}
	})
},

loadingFromServer: function(data){
	this._allUpgrades = [this._strength, this._speed, this._magicCapacity, this._magnetRadius,
						 this._luck, this._piercing, this._snowBallCraft, this._snowBallMagicRadius];
	this._curGifts = parseInt(data.curGifts, 10) || 0;
	this._maxGifts = parseInt(data.maxGifts, 10) || 0;
	this._maxDistance = parseInt(data.maxDistance, 10) || 0;
	this._maxKills = parseInt(data.maxKills, 10) || 0;
	this._maxScore = parseInt(data.maxScore, 10) || 0;
	this._totalGifts = parseInt(data.totalGifts, 10) || 0;
	this._totalDistance = parseInt(data.totalDistance, 10) || 0;
	this._totalKills = parseInt(data.totalKills) || 0;
	for(var i = 0; i < this._allUpgrades.length; i++){
		this._allUpgrades[i].level =parseInt( data[i], 10) || 0;
	}
},

initializeAttr: function() {
	this._allUpgrades = [this._strength, this._speed, this._magicCapacity, this._magnetRadius,
						 this._luck, this._piercing, this._snowBallCraft, this._snowBallMagicRadius];
	this._curGifts = 0;
	this._maxGifts = 0;
	this._maxDistance = 0;
	this._maxKills = 0;
	this._maxScore = 0;
	this._totalGifts = 0;
	this._totalDistance = 0;
	this._totalKills = 0;
	for(var i = 0; i < this._allUpgrades.length; i++){
		this._allUpgrades[i].level = 0;
	}
},

buyFor: function(x) {
	this._curGifts -= x;
},

saveGame: function(){
	let saveData = {};
	saveData.maxGifts = this._maxGifts;
	saveData.maxDistance = this._maxDistance;
	saveData.maxKills = this._maxKills;
	saveData.curGifts = this._curGifts;
	saveData.maxScore = this._maxScore;
	saveData.totalGifts = this._totalGifts;
	saveData.totalKills = this._totalKills;
	saveData.totalDistance = this._totalDistance;
	for(var i = 0; i < this._allUpgrades.length; i++){
		saveData[i] = this._allUpgrades[i].level;
	}
	$.ajax({
		'url': '/loginCheck',
		'type': 'get',
		'success': function(response){
			if(response){
				Player.saveGameServer(saveData);
			}else{
				Player.saveGameLocal(saveData)
			};
		}
	})

},

saveGameLocal: function(saveData){
	if(typeof(Storage) !== "undefined") {
		localStorage.maxGifts = saveData.maxGifts;
		localStorage.maxDistance = saveData.maxDistance;
		localStorage.maxKills = saveData.maxKills;
		localStorage.curGifts = saveData.curGifts;
		localStorage.maxScore = saveData.maxScore;
		localStorage.totalGifts = saveData.totalGifts;
		localStorage.totalKills = saveData.totalKills;
		localStorage.totalDistance = saveData.totalDistance;
		for(var i = 0; i < this._allUpgrades.length; i++){
			localStorage[i] = saveData[i];
		}
	} else {
		// Sorry! No Web Storage support..
	}
},

saveGameServer: function(saveData){
	$.ajax({
		'url': '/saveGame',
		'type': 'post',
		'data': {'saveData': saveData},
		'success': function(response){
		}
	})
},

clearGame: function(){
	$.ajax({
		'url': '/loginCheck',
		'type': 'get',
		'success': function(response){
			if(response){

			}else{
				if(typeof(Storage) !== "undefined") {
					localStorage.clear();
					Player._maxGifts = 0;
					Player._maxDistance = 0;
					Player._maxKills = 0;
					Player._curGifts = 0;
					Player._maxScore = 0;
					Player._totalGifts = 0;
					Player._totalKills = 0;
					Player._totalDistance = 0;
					for(var i = 0; i < this._allUpgrades.length; i++){
						Player._allUpgrades[i].level = 0;
					}
				} else {
					// Sorry! No Web Storage support..
				}
			};
		}
	})

},
//Upgrades-----------------------------

upgradeStrength: function(){
	this.buyFor(this._strength.cost[this._strength.level]);
	this._strength.level++;
},

upgradeSpeed: function(){
	this.buyFor(this._speed.cost[this._speed.level]);
	this._speed.level++;
},

upgradeMagicFuel: function(){
	this.buyFor(this._magicCapacity.cost[this._magicCapacity.level]);
	this._magicCapacity.level++;
},

upgradeMagnet: function(){
	this.buyFor(this._magnetRadius.cost[this._magnetRadius.level]);
	this._magnetRadius.level++;
},

upgradeLuck: function(){
	this.buyFor(this._luck.cost[this._luck.level]);
	this._luck.level++;
},

upgradePiercing: function(){
	this.buyFor(this._piercing.cost[this._piercing.level]);
	this._piercing.level++;
},

upgradeSnowBallCraft: function(){
	this.buyFor(this._snowBallCraft.cost[this._snowBallCraft.level]);
	this._snowBallCraft.level++;
},

upgradeSnowBallMagicRadius: function(){
	this.buyFor(this._snowBallMagicRadius.cost[this._snowBallMagicRadius.level]);
	this._snowBallMagicRadius.level++;
},



//CanUps-------------------------------
canUpStrength: function(){
	if(this._strength.cost[this._strength.level] <= this._curGifts && this._strength.level < this._strength.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpSpeed: function(){
	if(this._speed.cost[this._speed.level] <= this._curGifts && this._speed.level < this._speed.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpMagicFuel: function(){
	if(this._magicCapacity.cost[this._magicCapacity.level] <= this._curGifts && this._magicCapacity.level < this._magicCapacity.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpMagnet: function(){
	if(this._magnetRadius.cost[this._magnetRadius.level] <= this._curGifts && this._magnetRadius.level < this._magnetRadius.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpLuck: function(){
	if(this._luck.cost[this._luck.level] <= this._curGifts && this._luck.level < this._luck.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpPiercing: function(){
	if(this._piercing.cost[this._piercing.level] <= this._curGifts && this._piercing.level < this._piercing.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpSnowBallCraft: function(){
	if(this._snowBallCraft.cost[this._snowBallCraft.level] <= this._curGifts && this._snowBallCraft.level < this._snowBallCraft.levels.length-1){
		return true;
	}else{
		return false;
	}
},

canUpSnowBallMagicRadius: function(){
	if(this._snowBallMagicRadius.cost[this._snowBallMagicRadius.level] <= this._curGifts && this._snowBallMagicRadius.level < this._snowBallMagicRadius.levels.length-1){
		return true;
	}else{
		return false;
	}
},

//Getters------------------------------

getDamage: function(){
	return this._strength.base * this._strength.levels[this._strength.level];
},

getSnowBallVelovity(){
	return (this._strength.base * this._strength.levels[this._strength.level])/10 + 8;
},

getSpeed: function(){
	return this._speed.base * this._speed.levels[this._speed.level];
},

getMagicCapacity: function(){
	return this._magicCapacity.base * this._magicCapacity.levels[this._magicCapacity.level];
},

getMagicComsuption: function(){
	return this._magicComsuption.base * this._magicComsuption.levels[this._magicCapacity.level];
},

getMagnetRadius: function(){
	return this._magnetRadius.base * this._magnetRadius.levels[this._magnetRadius.level];
},

getLuck: function(){
	return this._luck.base * this._luck.levels[this._luck.level];
},

getPiercing: function(){
	return this._piercing.base * this._piercing.levels[this._piercing.level];
},

getMojoBars: function(){
	return this._mojoBars.base * this._mojoBars.levels[this._mojoBars.level];
},

getSnowBallCraftSpeed: function(){
	return this._snowBallCraft.base - this._snowBallCraft.levels[this._snowBallCraft.level];
},

getSnowBallCapacity: function(){
	return this._snowBallsCapacity.base + this._snowBallsCapacity.levels[this._snowBallCraft.level];
},

getSnowBallMagicRadius: function(){
	return this._snowBallMagicRadius.base * this._snowBallMagicRadius.levels[this._snowBallMagicRadius.level];
},

getSnowBallMagicDamage: function(){
	return this._snowBallMagicDamage.base * this._snowBallMagicDamage.levels[this._snowBallMagicRadius.level];
},

getMaxGifts: function(){
	return this._maxGifts;
},

getCurGifts: function() {
	return this._curGifts;
},

getMaxDistance: function() {
	return this._maxDistance;
},

getMaxKills: function() {
	return this._maxKills;
},

getMaxScore: function() {
	return this._maxScore;
},

getLastScore: function() {
	return this._lastScore;
},

getLastGift: function() {
	return this._lastGifts;
},

getLastKill: function() {
	return this._lastKills;
},

getLastDistance: function() {
	return this._lastDistance;
},

getTotalGifts: function() {
	return this._totalGifts;
},

getTotalKills: function() {
	return this._totalKills;
},

getTotalDistance: function() {
	return this._totalDistance;
},

getCostAndLevel: function(){
	var costAndLevel = [];
	for(var i = 0; i < this._allUpgrades.length; i++){
		costAndLevel.push([this._allUpgrades[i].cost[this._allUpgrades[i].level],this._allUpgrades[i].level,this._allUpgrades[i].levels.length-1])
	}
	return costAndLevel;
},

addGifts: function(gifts) {
	this._totalGifts += gifts;
	this._curGifts += gifts;
	this._lastGifts = gifts;
	if(this._maxGifts < gifts) this._maxGifts = gifts;
},

addMaxDistance: function(distance) {
	this._lastDistance = distance;
	this._totalDistance += distance;
	if(this._maxDistance < distance)
		this._maxDistance = distance;
},

addTotalKills: function(kill) {
	this._lastKills = kill;
	this._totalKills += kill;
	if(this._maxKills < kill) this._maxKills = kill;
},

addScore: function(score) {
	this._lastScore = score;
	if(this._maxScore < score ) this._maxScore = score;

}

}


Player.deferredSetup();
