/*	-INFORMATION-
	Subject:	Classes, Subclasses, & Spells
	Effect:		This script adds the content from the 2023 Unearthed Arcana "Player's Handbook Playtest 8" article.
				This file has been made by MasterJedi2014, borrowing a lot of code from MPMB and those who have contributed to the sheet's existing material.
	Code by:	MasterJedi2014, using MorePurpleMoreBetter's code as reference; Monk class & class options code by user @Nod
	Date:		2024-05-21 (sheet v13.1.0)
*/

var iFileName = "UA2023PT8 Content [by MasterJedi2014] V4.js";
RequiredSheetVersion("13.1.0");

SourceList["UA23PT8"] = {
	name : "Unearthed Arcana 2023: Player's Handbook Playtest 8",
	abbreviation : "UA23PT8",
	date : "2023/11/23",
	url : "https://media.dndbeyond.com/compendium-images/ua/ph-playtest8/gHvtmY50loGLgQUb/UA2023-PH-Playtest8.pdf",
};

SourceList["UAM"] = {
	name : "UA Monk",
	abbreviation : "UAM",
	group : "Treasure Coast Tabletop Club",
	date : "2023/11/27"
};

SourceList["MJ:HB"] = {
	name : "MasterJedi2014's Homebrew",
	abbreviation : "MJ:HB",
	date : "2024/05/21",
};

// Add UA23PT8 Barbarian class
ClassList.barbarian_ua23pt8 = {
	name : "Barbarian (UA:PT-viii)",
	regExpSearch : /^((?=.*(marauder|barbarian|(norse|tribes?|clans?)(wo)?m(a|e)n))|((?=.*(warrior|fighter))(?=.*(feral|tribal)))).*$/i,
	source : [["UA23PT8", 1], ["MJ:HB", 0]],
	primaryAbility : "Strength",
	prerequisite : "Strength 13+",
	prereqeval : function(v) {
		return (What('Str') >= 13);
	},
	die : 12,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Str", "Con"],
	skills : ["\n\n" + toUni("Barbarian") + ": Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival", ""],
	armor : [
		[true, true, false, true],
		[false, false, false, true],
	],
	weapons : [
		[true, true, [""]],
		[false, true, [""]],
	],
	equipment : "Barbarian starting equipment:" +
		"\n \u2022 Explorer's Pack," +
		"\n \u2022 Handaxe (4)," +
		"\n \u2022 Greataxe \u0026 15 gp -or- Battleaxe, Shield, \u0026 25 gp" +
		"\n\nAlternatively, choose 75 gp worth of starting equipment instead of the class' starting equipment.",
	subclasses : ["Primal Path", []],
	attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	features : {
		"rage ua23pt8" : { //Ripped directly from "ListsClasses.js" and then heavily altered
			name : "Rage",
			source : [["UA23PT8", 3], ["SRD", 8], ["P", 48], ["MJ:HB", 0]],
			minlevel : 1,
			description : desc([
				"Start/end as Bonus Action when not wearing Heavy Armor; add damage to melee weapons that use Str.",
				"Adv. on Strength checks/saves (not attacks); Resistance to Bludgeoning/Piercing/Slashing.",
				"While Raging, I can't maintain Concentration on a spell, nor can I cast spells.",
				"The Rage lasts until the end of my next turn, \u0026 it ends early if I don Heavy Armor or have",
				"  the Incapacitated condition. If my Rage is still active on my next turn, I can extend the Rage",
				"  for another round by doing one of more of the following: Make an attack roll against an enemy,",
				"  force an enemy to make a saving throw, or take a Bonus Action to extend my Rage.",
				"I can maintain a Rage for up to 10 minutes. I regain one expended Rage upon finishing a Short Rest.",
			]),
			additional : levels.map(function (n) {
				return "+" + (n < 9 ? 2 : n < 16 ? 3 : 4) + " melee damage";
			}),
			usages : [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, "\u221E\xD7 per "],
			recovery : "long rest",
			action : ["bonus action", " (start/end)"],
			dmgres : [["Bludgeoning", "Bludgeon. (in rage)"], ["Piercing", "Piercing (in rage)"], ["Slashing", "Slashing (in rage)"]],
			savetxt : { text : ["Adv. on Str saves in rage"] },
			calcChanges : {
				atkCalc : [
					function (fields, v, output) {
						if ((v.theWea.ability = 1) && classes.known.barbarian_ua23pt8 && classes.known.barbarian_ua23pt8.level && (/\brage\b/i).test(v.WeaponTextName)) {
							output.extraDmg += classes.known.barbarian_ua23pt8.level < 9 ? 2 : classes.known.barbarian_ua23pt8.level < 16 ? 3 : 4;
						}
					},
					"If I include the word 'Rage' in a melee weapon's name, the calculation will add my Rage's bonus damage to it."
				]
			}
		},
		"unarmored defense ua23pt8" : { //Ripped directly from "ListsClasses.js"
			name : "Unarmored Defense",
			source : [["UA23PT8", 3], ["SRD", 8], ["P", 48]],
			minlevel : 1,
			description : desc("Without armor, my AC is 10 + Dexterity modifier + Constitution modifier + shield"),
			armorOptions : [{
				regExpSearch : /justToAddToDropDown/,
				name : "Unarmored Defense (Con)",
				source : [["SRD", 8], ["P", 48]],
				ac : "10+Con",
				affectsWildShape : true
			}],
			armorAdd : "Unarmored Defense (Con)",
		},
		"weapon mastery ua23pt8" : { //Ripped directly from the Fighter in "UA2023PT7 Content [by MasterJedi2014] V4.js" and then altered
			/* This feature calls the masteryFunctions.weaponMasteryAtkAdd function (made by Joost/MPMB) for the
			actual weapon description alterations. The feature also lets the user select via extrachoices what
			Weapons they currently have chosen to add Mastery properties to. The extrachoices options are
			functionally useless, but I'm leaving it in here because I know some users in my own play group need
			what the extrachoices does to realize "Oh, I need to remove the word 'Mastery' from one of my weapons
			to use the Mastery property of a different weapon".
			Joost/MPMB, you can remove the extrachoices aspect of this if you want when you get around to updating
			the sheet code yourself for the revised rules.*/
			name : "Weapon Mastery",
			source : [["UA23PT8", 3], ["MJ:HB", 0]],
			minlevel : 1,
			description : desc([
				"I can use the Mastery property of 2 kinds of weapons of my choice.",
				"I can change what weapons I can use the Mastery property of after finishing a Long Rest.",
				"I can choose 3 kinds of weapons when I reach Barbarian lvl 4 \u0026 4 kinds at Barbarian Lvl 10.",
				"My chosen weapon types will appear in the pg 3 Notes section.",
			]),
			calcChanges : {
				atkAdd : masteryFunctions.weaponMasteryAtkAdd
			},
			extraname : "Weapon Mastery",
			extrachoices : ["Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "Light Hammer", "Mace", "Quarterstaff", "Sickle", "Spear", "Light Crossbow", "Dart", "Shortbow", "Sling", "Battleaxe", "Flail", "Glaive", "Greataxe", "Greatsword", "Halberd", "Lance", "Longsword", "Maul", "Morningstar", "Pike", "Rapier", "Scimitar", "Shortsword", "Trident", "War Pick", "Warhammer", "Whip", "Blowgun", "Hand Crossbow", "Heavy Crossbow", "Longbow", "Pistol", "Musket", "Pistol Automatic", "Revolver", "Hunting Rifle", "Automatic Rifle", "Shotgun", "Laser Pistol", "Antimatter Rifle", "Laser Rifle"],
			extraTimes : levels.map(function (n) { return n < 4 ? 2 : n < 10 ? 3 : 4; }),
			"club" : {
				name : "Club",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"dagger" : {
				name : "Dagger",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"greatclub" : {
				name : "Greatclub",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"handaxe" : {
				name : "Handaxe",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"javelin" : {
				name : "Javelin",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"light hammer" : {
				name : "Light Hammer",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"mace" : {
				name : "Mace",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"quarterstaff" : {
				name : "Quarterstaff",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"sickle" : {
				name : "Sickle",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"spear" : {
				name : "Spear",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"light crossbow" : {
				name : "Light Crossbow",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"dart" : {
				name : "Dart",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"shortbow" : {
				name : "Shortbow",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"sling" : {
				name : "Sling",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"battleaxe" : {
				name : "Battleaxe",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"flail" : {
				name : "Flail",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"glaive" : {
				name : "Glaive",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"greataxe" : {
				name : "Greataxe",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"greatsword" : {
				name : "Greatsword",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"halberd" : {
				name : "Halberd",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"lance" : {
				name : "Lance",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"longsword" : {
				name : "Longsword",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"maul" : {
				name : "Maul",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"morningstar" : {
				name : "Morningstar",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"pike" : {
				name : "Pike",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"rapier" : {
				name : "Rapier",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"scimitar" : {
				name : "Scimitar",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"shortsword" : {
				name : "Shortsword",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"trident" : {
				name : "Trident",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"war pick" : {
				name : "War Pick",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"warhammer" : {
				name : "Warhammer",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"whip" : {
				name : "Whip",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"blowgun" : {
				name : "Blowgun",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"hand crossbow" : {
				name : "Hand Crossbow",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"heavy crossbow" : {
				name : "Heavy Crossbow",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"longbow" : {
				name : "Longbow",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"pistol" : {
				name : "Pistol",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"musket" : {
				name : "Musket",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"pistol automatic" : {
				name : "Pistol Automatic",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"revolver" : {
				name : "Revolver",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"hunting rifle" : {
				name : "Hunting Rifle",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"automatic rifle" : {
				name : "Automatic Rifle",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"shotgun" : {
				name : "Shotgun",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"laser pistol" : {
				name : "Laser Pistol",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"antimatter rifle" : {
				name : "Antimatter Rifle",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
			"laser rifle" : {
				name : "Laser Rifle",
				source : [["UA23PT8", 3], ["MJ:HB", 0]],
				description : "I can use the Mastery Property of this kind of weapon.",
			},
		},
		"reckless attack ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Reckless Attack",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 48], ["MJ:HB", 0]],
			minlevel : 2,
			description : desc([
				"Adv. on Str. based attacks until the start of my next turn, but attacks vs. me adv. until next turn.",
			]),
		},
		"danger sense ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Danger Sense",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 48], ["MJ:HB", 0]],
			minlevel : 2,
			description : desc("Adv. on Dexterity saves unless I am Incapacitated."),
			savetxt : { text : ["Adv. on Dex saves unless Incapacitated"] },
		},
		"subclassfeature3" : { //Ripped directly from "ListsClasses.js"
			name : "Primal Path",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 48]],
			minlevel : 3,
			description : desc('Choose a Primal Path that shapes the nature of your rage and put it in the "Class" field.')
		},
		"primal knowledge ua23pt8" : {
			name : "Primal Knowledge",
			source : [["UA23PT8", 4], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"I gain proficiency in another skill of my choice from the list of skills for a Barb at Lvl 1.",
				"Whenever I make an ability check using one of the following skills, I can make it a Str. check:",
				"  Acrobatics, Intimidation, Perception, Stealth, or Survival.",
			]),
			skillstxt : "Choose one from Animal Handling, Athletics, Intimidation, Nature, Perception, Survival",
		},
		"fast movement ua23pt8" : { //Ripped directly from "ListsClasses.js"
			name : "Fast Movement",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 49]],
			minlevel : 5,
			description : desc("I gain +10 ft speed when I'm not wearing Heavy Armor."),
			speed : { allModes : "+10" },
		},
		"feral instinct ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Feral Instinct",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 7,
			description : desc("I get adv. on Initiative rolls."),
			advantages : [["Initiative", true]],
		},
		"instinctive pounce ua23pt8" : {
			name : "Instinctive Pounce",
			source : [["UA23PT8", 4], ["MJ:HB", 0]],
			minlevel : 7,
			description : desc("As part of the Bonus Action used to enter a Rage, I can Move up to half my Speed."),
		},
		"brutal strike ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Brutal Strike", //Previously known as "Brutal Critical"
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 9,
			description : desc([
				"If I use Reckless Attack, I can forgo Adv. on the next attack roll I make on my turn with a Str.",
				"  based attack. If that attack hits, the target takes an extra 1d10 damage of the type dealt by",
				"  the attack, \u0026 I can use on Brutal Strike effect of my choice.",
				"I currently have the following effect options:",
				" \u2022 Forceful Blow. The target is pushed 15 ft straight away from me. I can then Move up to half",
				"  my Speed straight toward the target without provoking Opportunity Attacks.",
				" \u2022 Hamstring Blow. The target’s Speed is reduced by 15 ft until the start of my next turn.",
			]),
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if ((v.theWea.ability = 1) && classes.known.barbarian_ua23pt8 && classes.known.barbarian_ua23pt8.level > 8) {
							fields.Description += (fields.Description ? ', ' : '') + '+1d10 if Reckless Attack w/o Adv.';
						}
					},
					"If I forgo Adv. on the next attack roll on my turn I make with a Str. based attack, the target takes an extra 1d10 damage on a hit.",
					900,
				]
			},
		},
		"relentless rage ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Relentless Rage",
			source : [["UA23PT8", 4], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 11,
			description : " [DC 10 + 5 per try, per short rest]" + desc([
				"If I drop to 0 HP while Raging, I can make a DC 10 Constitution save.",
				"The DC increases by 5 for every attempt until I finish a Short or Long Rest.",
				"If I succeed, my HP changes to a number equal to twice my Barbarian lvl.",
			]),
			additional : levels.map( function(n) {
				return n < 11 ? "" : "HP Gain: " + (n * 2);
			}),
			extraLimitedFeatures : [{
				name : "Relentless Rage",
				usages : 1,
				recovery : "short rest",
				usagescalc : "var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = What('Limited Feature Used ' + FieldNmbr); var DCmod = Number(usages) * 5; event.value = (isNaN(Number(usages)) || usages === '') ? 'DC\u2003\u2003' : 'DC ' + Number(10 + DCmod);"
			}],
		},
		"brutal strike improvement ua23pt8" : {
			name : "Brutal Strike Improvement",
			source : [["UA23PT8", 4], ["MJ:HB", 0]],
			minlevel : 13,
			description : desc([
				"The following effects are now among my Brutal Strike options:",
				" \u2022 Staggering Blow. The target has Disadv. on the next saving throw it makes, \u0026 it can’t make",
				"   Opportunity Attacks until the start of my next turn.",
				" \u2022 Sundering Blow. The next attack roll by another creature against the target gains a bonus",
				"  to that roll equal to my Rage Damage value.",
			]),
		},
		"persistent rage ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Persistent Rage",
			source : [["UA23PT8", 5], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 15,
			description : desc([
				"Once per Long Rest, when I roll Initiative, I can regain all expended uses of Rage.",
				"Additionally, my Rage only lasts less than 10 minutes if I fall Unconscious (instead of Incapacitated),",
				"  don Heavy Armor, or if I choose to end it early.",
			]),
			usages : 1,
			recovery : "long rest",
		},
		"indomitable might ua23pt8" : { //Ripped directly from "ListsClasses.js"
			name : "Indomitable Might",
			source : [["UA23PT8", 5], ["SRD", 9], ["P", 49]],
			minlevel : 18,
			description : desc("If a Strength check is lower than my Strength score, I can use my Strength score instead.")
		},
		"primal champion" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Primal Champion",
			source : [["UA23PT8", 5], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 20,
			description : desc("I add +4 to both my Strength and Constitution, and their maximums increase to 26."),
			scores : [4,0,4,0,0,0],
			scoresMaximum : [26,0,26,0,0,0],
		},
	},
};

////// Add UA23PT7 Path of the Beserker Barbarian subclass
AddSubClass("barbarian_ua23pt8", "beserker_ua23pt7", { //Ripped directly from "ListsClasses.js" and then altered
	regExpSearch : /^((?=.*\b(berserker|berserk|berserkr|ulfheonar)s?\b)|((?=.*(warrior|fighter))(?=.*(odin|thor)))).*$/i,
	subname : "Path of the Berserker",
	fullname : "Berserker (UA:PT-viii)",
	source : [["UA23PT7", 5], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
	abilitySave : 1,
	features : {
		"subclassfeature3" : {
			name : "Frenzy",
			source : [["UA23PT7", 5], ["SRD", 9], ["P", 49], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"If I use Reckless Attack with a Str. based attack while my Rage is active, I deal extra damage to",
				"  the 1st target I hit on my turn. The extra damage is my Rage Damage bonus in d6s, and consists",
				"  of the same type of damage as the attack normally deals.",
			]),
			additional : levels.map( function(n) {
				return "+" + (n < 9 ? 2 : n < 16 ? 3 : 4) + "d6 Frenzy damage";
			}),
		},
		"subclassfeature6" : {
			name : "Mindless Rage",
			source : [["UA23PT7", 5], ["SRD", 10], ["P", 49]],
			minlevel : 6,
			description : desc("While Raging, I can't be Charmed or Frightened, and such effects are suspended"),
			savetxt : { text : ["Immune to being Charmed/Frightened in Rage"] },
		},
		"subclassfeature10" : {
			name : "Retaliation",
			source : [["UA23PT7", 5], ["SRD", 10], ["P", 50], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc([
				"When an enemy within 5 ft damages me, I can make a melee attack as a Reaction.",
				"This melee attack can be made with a weapon or as an Unarmed Strike.",
			]),
			action : ["reaction", " (after taking damage)"]
		},
		"subclassfeature14" : {
			name : "Intimidating Presence",
			source : [["UA23PT7", 5], ["SRD", 10], ["P", 49], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"As a Bonus Action, Frighten creatures of my choice within 30 ft for 1 min if it fails a Wisdom save.",
				"If I am Raging, I can affect creatures within 60 ft instead. Creatures behind Total Cover cannot",
				"  be affected by this feature. A Frightened creature repeats the saving throw at the end of each",
				"  of its turns, ending the Frightened condition on itself on a successful save.",
				"I can do this once per Long Rest, though I can expend a use of Rage instead to activate this feature.",
			]),
			action : ["bonus action", ""],
			usages : 1,
			recovery : "long rest",
			altResource : "rage",
		},
	},
});

////// Add UA23PT7 Path of the Wild Heart Barbarian subclass (Formerly the Path of the Totem Warrior)
AddSubClass("barbarian_ua23pt8", "wild heart_ua23pt7", { //Ripped directly from "all_WotC_pub+UA.js" and then altered
	regExpSearch : /^(?=.*(wild heart))(?=.*totem)(?=.*(warrior|fighter|marauder|barbarian|viking|(norse|tribes?|clans?)(wo)?m(a|e)n)).*$/i,
	subname : "Path of the Wild Heart",
	fullname : "Wild Heart Barbarian (UA:PT-viii) (Formerly Totem Warrior)",
	source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Animal Speaker (Formerly 'Spirit Seeker')",
			source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"I can cast Beast Sense and Speak with Animals as rituals (PHB 217 \u0026 277).",
				"Wisdom is my spellcasting ability for these spells.",
			]),
			spellcastingBonus : {
				name : "Spirit Seeker",
				spells : ["beast sense", "speak with animals"],
				selection : ["beast sense", "speak with animals"],
				firstCol : "(R)",
				spellcastingAbility : 5,
				times : 2,
			},
			spellChanges : {
				"beast sense" : {
					time : "10 min",
					changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
				},
				"speak with animals" : {
					time : "10 min",
					changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
				},
			},
		},
		"subclassfeature3.1" : {
			name : "Rage of the Wilds (Formerly 'Totem Spirit')",
			source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				'Choose Rage of the Bear, Eagle, or Wolf using the "Choose Feature" button above.',
			]),
			choices : ["Bear", "Eagle", "Wolf"],
			"bear" : {
				name : "Rage of the Bear",
				description : desc([
					"When I activate Rage, I gain Resistance to 2 damage types of my choice, except Force/Psychic.",
					"I have Resistance to the chosen types until the Rage ends.",
					"I can change my \"Rage of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				dmgres : [["Bear Resist 1 (rage)", "Bear Resist 2 (rage)"]],
				eval : function() {
					processResistance(false, 'Barbarian: Rage', ClassList.barbarian_ua23pt8.features["rage ua23pt8"].dmgres);
				},
				removeeval : function() {
					processResistance(true, 'Barbarian: Rage', ClassList.barbarian_ua23pt8.features["rage ua23pt8"].dmgres);
				},
			},
			"eagle" : {
				name : "Rage of the Eagle",
				description : desc([
					"While Raging, I can use use a Bonus Action to take both the Dash \u0026 Disengage actions.",
					"I can change my \"Rage of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				action : ["bonus action", " (Dash \u0026 Disengage)"],
			},
			"wolf" : {
				name : "Rage of the Wolf",
				description : desc([
					"While Raging, friends have Adv. on melee attacks vs. hostiles within 10 ft of me.",
					"I can change my \"Rage of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
			},
		},
		"subclassfeature6" : {
			name : "Aspect of the Wilds (Formerly 'Aspect of the Beast')",
			source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
			minlevel : 6,
			description : "\n   " + 'Choose Aspect of the Elephant, Owl, or Spider using the "Choose Feature" button above',
			choices : ["Elephant", "Owl", "Spider"],
			"elephant" : {
				name : "Aspect of the Elephant",
				description : desc([
					"I gain Proficiency in the Athletics or Insight skill. If I'm already Proficient in the skill,",
					"  I gain Expertise in it instead.",
					"I can change my \"Aspect of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				skillstxt : "Choose one from Athletics or Insight; Gain Expertise if already Proficient in chosen skill",
			},
			"owl" : {
				name : "Aspect of the Owl",
				description : desc([
					"I gain Proficiency in the Investigation or Perception skill. If I'm already Proficient in the",
					"  skill, I gain Expertise in it instead.",
					"I can change my \"Aspect of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				skillstxt : "Choose one from Investigation or Perception; Gain Expertise if already Proficient in chosen skill",
			},
			"spider" : {
				name : "Aspect of the Spider",
				description : desc([
					"I gain Proficiency in the Stealth or Survival skill. If I'm already Proficient in the skill,",
					"  I gain Expertise in it instead.",
					"I can change my \"Aspect of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				skillstxt : "Choose one from Stealth or Survival; Gain Expertise if already Proficient in chosen skill",
			},
		},
		"subclassfeature10" : {
			name : "Nature Speaker (Formerly 'Spirit Walker')",
			source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
			minlevel : 10,
			description : "\n   " + "I can cast Commune with Nature as a ritual. Wisdom is my spellcasting ability for this spell.",
			spellcastingBonus : {
				name : "Spirit Walker",
				spells : ["commune with nature"],
				selection : ["commune with nature"],
				spellcastingAbility : 5,
				firstCol : "(R)"
			},
			spellChanges : {
				"commune with nature" : {
					time : "11 min",
					changes : "I can cast this spell only as a ritual, thus its casting time is 10 minutes longer."
				},
			},
		},
		"subclassfeature14" : {
			name : "Power of the Wilds (Formerly 'Totemic Attunement')",
			source : [["UA23PT7", 6], ["P", 50], ["MJ:HB", 0]],
			minlevel : 14,
			description : "\n   " + 'Choose Power of the Lion, Falcon, or Ram using the "Choose Feature" button',
			choices : ["Lion", "Falcon", "Ram"],
			"lion" : {
				name : "Power of the Lion",
				description : desc([
					"While Raging, any enemies within 5 ft has Disadv. on attacks vs. targets other than myself",
					"  or another Barbarian with this feature.",
					"I can change my \"Power of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
			},
			"falcon" : {
				name : "Power of the Falcon",
				description : desc([
					"While Raging without armor, I gain a Fly Speed equal to my Speed.",
					"I can change my \"Power of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
				speed : { fly : { spd : "walk", enc : "walk" } },
			},
			"ram" : {
				name : "Power of the Ram",
				description : desc([
					"If my melee attack hits a Large or smaller creature while Raging, it must make a Str save.",
					"The DC = 8 + Prof Bonus + Str Mod, and it is knocked Prone if it fails.",
					"I can change my \"Power of the Wilds\" choice whenever I gain a Barbarian lvl.",
				]),
			},
		},
	},
});

////// Add UA23PT8 Path of the World Tree Barbarian subclass; Introduced as a part of the One D&D/5.1E Playtests
AddSubClass("barbarian_ua23pt8", "world tree_ua23pt8", {
	regExpSearch : /^(?=.*world)(?=.*tree).*$/i,
	subname : "Path of the World Tree",
	fullname : "World Tree Barbarian (UA:PT-viii)",
	source : [["UA23PT8", 5], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Vitality of the Tree",
			source : [["UA23PT8", 5], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"When I activate my Rage, I gain my Barbarian lvl in Temp HP. Additionally, while my Rage is active,",
				"  at the start of each of my turns, I can give another creature within 10 ft Temp HP equal to my",
				"  my Rage Damage bonus in d6s. These Temp HP last until depleted or until my Rage ends.",
			]),
			additional : levels.map(function (n) {
				return "+" + (n < 9 ? 2 : n < 16 ? 3 : 4) + "d6 Temp HP to another per turn";
			}),
		},
		"subclassfeature6" : {
			name : "Branches of the Tree",
			source : [["UA23PT8", 5], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc([
				"While my Rage is active, I use my Reaction to force a creature that starts its turn within 30 ft",
				"  of me to make a Strength save (DC = 8 + Prof Bonus + Str Mod) or be teleported to an unoccupied",
				"  space I can see within 5 ft of me or in the nearest unoccupied space I can see. After teleporting,",
				"  I can reduce its Speed to 0 until the end of the current turn.",
				"The space the target teleports to must be a surface or liquid that can support it.",
			]),
			action : ["reaction", ""],
		},
		"subclassfeature10" : {
			name : "Battering Roots",
			source : [["UA23PT8", 6], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc([
				"While using a Melee weapon with the Heavy or Versatile property, my reach with that weapon increases",
				"  by 10 ft, and I can activate the Push or Topple property in addition to any other Mastery property",
				"  I am using with that weapon.",
			]),
/*
Mastery properties don't seem to be being added to weapons correctly for now, & I cannot figure out why.
This calcChanges code is based on the code from MPMB, but it seems to not be functioning at all for now;
  just to make sure that this code doesn't introduce any errors, it has been commented out for now.
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if ( !/mastery/i.test(v.WeaponTextName) ) return;
						var aOptionalMasteries = ['Slow'];
						if ( /heavy|versatile/i.test(fields.Description) ) {
							aOptionalMasteries.push('Push');
						}
						if ( /heavy|versatile/i.test(fields.Description) ) {
							aOptionalMasteries.push('Topple');
						}
						if ( v.mastery && aOptionalMasteries.indexOf(v.mastery) === -1 ) {
							aOptionalMasteries.push(v.mastery);
						}
						// Sort this new array
						aOptionalMasteries.sort();
						var sMasteries = 'Mstry: ' + aOptionalMasteries.join('/');
						// Add to the description (replace current "Mstry: X" if it exists)
						var rxMstry = /Mstry: (Slow|Nick|Push|Vex|Sap|Topple|Graze|Cleave)/i;
						if ( rxMstry.test(fields.Description) ) {
							fields.Description = fields.Description.replace(rxMstry, sMasteries);
							fields.Range = fields.Range.replace("Melee", "Melee (15 ft)");
						} else {
							// no "Mstry: X" string so just add it to the end
							fields.Description += (fields.Description ? '; ' : '') + sMasteries;
							fields.Range = fields.Range.replace("Melee", "Melee (15 ft)");
						}
					},
					'Weapons with the word "Mastery" & the Heavy or Versatile properties will have the Push & Topple Mastery properties appended to their descriptions.'
				],
			},*/
		},
		"subclassfeature14" : {
			name : "Travel Along the Tree",
			source : [["UA23PT8", 6], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"When I activate my Rage \u0026 as a Bonus Action while it's active, I can teleport up to 60 ft to",
				"  an unoccupied space I can see. Once per Rage, I can also bring up to 6 willing creatures within",
				"  10 ft of myself, increasing the teleport range to 500 ft. Each creature teleports to an",
				"  unoccupied space of my choice within 10 ft of me.",
			]),
			limfeaname : " (Teleport 6 others)",
			usages : 1,
			recovery : "rage",
		},
	},
});

////// Add UA23PT7 Path of the Zealot Barbarian subclass
AddSubClass("barbarian_ua23pt8", "zealot_ua23pt7", { //Ripped directly from "all_WotC_pub+UA.js" and then altered
	regExpSearch : /zealot/i,
	subname : "Path of the Zealot",
	fullname : "Zealot (UA:PT-viii)",
	source : [["UA23PT7", 7], ["X", 11], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Divine Fury",
			source : [["UA23PT7", 7], ["X", 11], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"While Raging, the first creature I hit with a weapon or Unarmed Strike in my turn gets extra damage.",
				"This is Necrotic or Radiant damage equal to 1d6 + half my Barbarian level.",
				'Choose a damage type using the "Choose Feature" button above.',
			]),
			additional : levels.map(function (n) { return n < 3 ? "" : "+1d6+" + Math.floor(n/2) + " damage"; }),
			choices : ["Necrotic Damage", "Radiant Damage"],
			"necrotic damage" : {
				name : "Divine Fury",
				description : desc([
					"While Raging, the first creature I hit with a weapon or Unarmed Strike in my turn gets extra damage.",
					"It takes an extra 1d6 + half my Barbarian level worth of Necrotic damage.",
				]),
				additional : levels.map(function (n) { return n < 3 ? "" : "+1d6+" + Math.floor(n/2) + " necrotic damage"; })
			},
			"radiant damage" : {
				name : "Divine Fury",
				description : desc([
					"While Raging, the first creature I hit with a weapon or Unarmed Strike in my turn gets extra damage.",
					"It takes an extra 1d6 + half my Barbarian level worth of Radiant damage.",
				]),
				additional : levels.map(function (n) { return n < 3 ? "" : "+1d6+" + Math.floor(n/2) + " radiant damage"; })
			},
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (!v.isSpell && classes.known.barbarian_ua23pt8 && classes.known.barbarian_ua23pt8.level > 2 && (/\brage\b/i).test(v.WeaponTextName)) {
							var theDMG = GetFeatureChoice('class', 'barbarian_ua23pt8', 'subclassfeature3');
							if (!theDMG) return;
							fields.Description += (fields.Description ? '; ' : '') + '+1d6+' + Math.floor(classes.known.barbarian_ua23pt8.level / 2) + ' ' + GetFeatureChoice('class', 'barbarian_ua23pt8', 'subclassfeature3') + ' on first hit each turn';
						};
					},
					"If I include the word 'Rage' in a melee weapon's name, it will show in its description that its first hit does extra damage."
				]
			},
		},
		"subclassfeature3.1" : {
			name : "Warrior of the Gods",
			source : [["UA23PT7", 7], ["X", 11], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"When a spell or magic item restores any of my HP, I can regain an extra d12 HP.",
				"I can use this benefit Con. mod number of times per Long Rest. Additionally, spells with the",
				"  sole effect of restoring me to life (not undeath) don't require Material comp.",
			]),
			limfeaname : " (+1d12 HP)",
			usages : "Constitution modifier per ",
			usagescalc : "event.value = Math.max(1, What('Con Mod'));",
			recovery : "long rest",
		},
		"subclassfeature6" : {
			name : "Fanatical Focus",
			source : [["UA23PT7", 8], ["X", 11]],
			minlevel : 6,
			description : desc([
				"When I fail a saving throw while Raging, I can reroll it and must use the new roll.",
				"I can use this ability only once per Rage."
			]),
			usages : 1,
			recovery : "rage",
		},
		"subclassfeature10" : {
			name : "Zealous Presence",
			source : [["UA23PT7", 8], ["X", 11], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc([
				"As a Bonus Action, I choose up to 10 creatures within 60 ft that can hear my battle cry.",
				"These creatures gain Adv. on attacks and saves until the start of my next turn.",
				"I can do this once per Long Rest, though I can expend a use of Rage instead to activate this feature.",
			]),
			usages : 1,
			recovery : "long rest",
			action : ["bonus action", ""],
			altResource : "rage",
		},
		"subclassfeature14" : {
			name : "Rage Beyond Death",
			source : [["UA23PT7", 8], ["X", 11], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"When my Relentless Rage successfully restores my HP, I gain the following benefits:",
				" \u2022 I have a Fly Speed equal to my Speed \u0026 can hover. I can move through creatures/objects",
				"  as if they were Difficult Terrain; I take 1d10 Force damage if I end turn inside creature/object.",
				" \u2022 When I'm hit by an attack roll, I can use my Reaction to turn that hit into a miss.",
				"This form lasts for 1 minute or until I regain any HP or drop to 0 HP.",
			]),
			usages : 1,
			recovery : "long rest",
			action : ["reaction", " (change enemy hit to miss)"],
		},
	},
});

// Add UA23PT8 Druid class
ClassList.druid_ua23pt8 = {
	name : "Druid (UA:PT-viii)",
	regExpSearch : /druid/i,
	source : [["UA23PT8", 7], ["MJ:HB", 0]],
	primaryAbility : "Wisdom",
	prerequisite : "Wisdom 13+",
	prereqeval : function(v) {
		return (What('Wis') >= 13);
	},
	die : 8,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Int", "Wis"],
	skills : ["\n\n" + toUni("Druid") + ": Choose two from Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival", ""],
	toolProfs : {
		primary : [["Herbalism Kit", "Wis"]],
	},
	armor : [
		[true, false, false, true],
		[true, false, false, true],
	],
	weapons : [
		[true, false, [""]],
		[false, false, [""]],
	],
	equipment : "Druid starting equipment:" +
		"\n \u2022 Druidic Focus (Quarterstaff)," +
		"\n \u2022 Explorer's Pack," +
		"\n \u2022 Herbalism Kit," +
		"\n \u2022 Leather Armor," +
		"\n \u2022 Shield," +
		"\n \u2022 Sickle," +
		"\n \u2022 9 gp" +
		"\n\nAlternatively, choose 50 gp worth of starting equipment instead of the class' starting equipment.",
	subclasses : ["Druid Circle", []],
	attacks : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	abilitySave : 5,
	spellcastingFactor : 1,
	spellcastingKnown : {
		cantrips : [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		spells : "list",
		prepared : true,
	},
	spellcastingList : {
		class : ["druid", "druid_ua23pt8"],
	},
	features : {
		"druidic ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Druidic",
			source : [["UA23PT8", 8], ["SRD", 19], ["P", 66], ["MJ:HB", 0]],
			minlevel : 1,
			description : desc([
				"I know Druidic; Hidden messages with it can only be understood by those who know Druidic.",
				"Others can spot messages written in Druidic with a DC15 Investigation check.",
				"I also always have the Speak with Animals spell prepared.",
			]),
			languageProfs : ["Druidic"],
			spellcastingExtra : ["speak with animals"],
		},
		"primal order ua23pt8" : { //Ripped from Cleric in "UA2023PT6 Content [by MasterJedi2014] V4.js" and then altered
			name : "Primal Order",
			source : [["UA23PT8", 8], ["MJ:HB", 0]],
			minlevel : 1,
			description : "\n   " + "Choose a Primal Order using the \"Choose Feature\" button above. The chosen option will appear in pg 3's Notes section.",
		},
		"spellcasting ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Spellcasting",
			source : [["UA23PT8", 9], ["SRD", 19], ["P", 66], ["MJ:HB", 0]],
			minlevel : 1,
			description : desc([
				"I can cast prepared Druid cantrips/spells, using Wisdom as my spellcasting ability.",
				"I can use a Druidic Focus as a spellcasting focus for my Druid spells.",
				"I can cast my prepared Druid spells as Rituals if they have the Ritual tag.",
				"I can swap a known Druid cantrip for another every time I gain a Druid lvl.",
			]),
			additional : levels.map(function (n, idx) { //Ripped from Warlock in "UA2023PT7 Content [by MasterJedi2014] V4.js" and then altered
				var cantr = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4][idx];
				var splls = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22][idx];
				return cantr + " cantrips known \u0026 " + splls + " spells prepared";
			}),
		},
		"wild companion ua23pt8" : { //Ripped directly from "all_WotC_pub+UA.js" and then altered
			name : "Wild Companion",
			source : [["UA23PT8", 9], ["T", 35], ["UA:CFV", 4], ["MJ:HB", 0]],
			minlevel : 2,
			description : desc([
				"I can expend a use of Wild Shape or a spell slot to cast Find Familiar without material comp.",
				"The Familiar always has the Fey type and disappears when I finish a Long Rest."
			]),
			spellcastingBonus : {
				name : "Wild Companion",
				spells : ["find familiar", "find familiar ua23dp"],
				selection : ["find familiar", "find familiar ua23dp"],
				firstCol : "Sp",
				times : 2,
			},
			spellChanges : {
				"find familiar" : {
					components : "V,S",
					compMaterial : "",
					description : "Gain the services of a fey familiar; can see through its eyes; it can deliver touch spells; see B",
					duration : "until Long Rest",
					changes : "By using my Wild Companion class feature, I can expend a spell slot of a use of Wild Shape to cast Find Familiar without material components. The familiar created this way always has the Fey type and disappears when I finish a Long Rest."
				},
				"find familiar ua23dp" : {
					components : "V,S",
					compMaterial : "",
					description : "Gain the services of a fey familiar; can see through its eyes; it can deliver touch spells; see B",
					duration : "until Long Rest",
					changes : "By using my Wild Companion class feature, I can expend a spell slot of a use of Wild Shape to cast Find Familiar without material components. The familiar created this way always has the Fey type and disappears when I finish a Long Rest."
				},
			},
		},
		"subclassfeature2.wild shape" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Wild Shape",
			source : [["UA23PT8", 9], ["SRD", 20], ["P", 66], ["MJ:HB", 0]],
			minlevel : 2,
			description : desc([
				"As a Bonus Action, I assume the shape of a Beast I have seen before with the following rules:",
				" \u2022 I gain all its game statistics except HD, HP, Int, Wis, Cha, \u0026 Proficiency Bonus;",
				" \u2022 I retain class features, languages, \u0026 feats, but I don't retain special senses;",
				" \u2022 I also retain my personality, memories, \u0026 ability to speak;",
				" \u2022 I keep my skill/saving throw prof.; if it has the same prof, I use whichever bonus is higher;",
				" \u2022 I can't cast spells in Beast form, but transforming doesn't break Concentration;",
				" \u2022 I can choose whether equipment falls to the ground, merges, or stays worn;",
				" \u2022 I gain Temp HP equal to my Druid level;",
				"I revert by running out of time, using Wild Shape again, or using a Bonus Action to end it.",
				"I regain one expended use of Wild Shape when I finish a Short Rest.",
				"I know a number of forms equal to 2 + half my Druid lvl (round up).",
			]),
			usages : [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, "\u221E\xD7 per "],
			recovery : "long rest",
			additional : levels.map(function (n) {
				if (n < 2) return "";
				var frms = 2 + Math.ceil(n/2);
				var cr = n < 4 ? "1/4" : n < 8 ? "1/2" : 1;
				var hr = Math.floor(n/2);
				var restr = n < 8 ? ", no Fly" : "";
				return frms + " forms known; CR " + cr + restr + "; " + hr + (restr.length ? " h" : " hours") + "; " + n + " Temp HP";
			}),
			limfeaname : "Wild Shape",
			action : ["bonus action", " (start/end)"],
		},
		"subclassfeature3" : { //Ripped directly from "ListsClasses.js"
			name : "Druid Circle",
			source : [["UA23PT8", 10], ["SRD", 21], ["P", 67]],
			minlevel : 3,
			description : desc('Choose a Circle you can identify with and put it in the "Class" field.')
		},
		"wild resurgence ua23pt8" : {
			name : "Wild Resurgence",
			source : [["UA23PT8", 10], ["MJ:HB", 0]],
			minlevel : 5,
			description : desc([
				"If I have no uses of Wild Shape left, I can give myself one by expending a spell slot (no",
				"  action required). I can do this only once per turn.",
				"Once per Long Rest, I can convert 1 use of Wild Shape into a 1st-lvl spell slot.",
			]),
			usages : 1,
			recovery : "long rest",
		},
		"elemental fury ua23pt8" : { //Ripped from Cleric in "UA2023PT6 Content [by MasterJedi2014] V4.js" and then altered
			name : "Elemental Fury",
			source : [["UA23PT8", 10], ["MJ:HB", 0]],
			minlevel : 7,
			description : "\n   " + "Choose an Elemental Fury option using the \"Choose Feature\" button above. The chosen option will appear in pg 3's Notes section.",
		},
		"commune with nature ua23pt8" : { //Ripped from Cleric in "UA2023PT6 Content [by MasterJedi2014] V4.js" and then altered
			name : "Commune with Nature",
			source : [["UA23PT8", 11], ["MJ:HB", 0]],
			minlevel : 9,
			description : desc([
				"I now always have the Commune with Nature spell prepared.",
			]),
			spellcastingBonus : {
				name : "Commune with Nature",
				spells : ["commune with nature"],
				selection : ["commune with nature"],
				times : 1,
			},
		},
		"improved elemental fury ua23pt8" : { //Ripped from Cleric in "UA2023PT6 Content [by MasterJedi2014] V4.js" and then altered
			name : "Improved Elemental Fury",
			source : [["UA23PT8", 11], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"The option I chose for Elemental Fury at 7th Lvl grows more powerful.",
			]),
		},
		"beast spells ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Beast Spells",
			source : [["UA23PT8", 11], ["SRD", 21], ["P", 67], ["MJ:HB", 0]],
			minlevel : 18,
			description : desc([
				"I can cast Druid spells while in a Beast form unless the spell has a costly Material component",
				"  or if it consumes its Material component.",
			]),
		},
		"archdruid ua23pt8" : { //Ripped directly from "ListsClasses.js" and then altered
			name : "Archdruid",
			source : [["UA23PT8", 11], ["SRD", 21], ["P", 67], ["MJ:HB", 0]],
			minlevel : 20,
			description : desc([
				"When I roll Initiative with no uses of Wild Shape left, I regain one expended use.",
				"I can convert uses of Wild Shape into a single spell slot (no action required). Each Wild Shape",
				"  use can be converted to 2 spell levels. EX: 2 Wild Shape uses = 1 lvl 4 spell slot. I can do",
				"  this once per Long Rest.",
				"I age more slowly, only 1 year for every 10 years that pass."
			]), //"Timeless Body" was rolled into "Archdruid"
			limfeaname : "Archdruid: Convert Wild Shapes to Spell Slot",
			usages : 1,
			recovery : "long rest",
		},
	},
};

//// Add Druid "Primal Order" choices
AddFeatureChoice(ClassList.druid_ua23pt8.features["primal order ua23pt8"], true, "Primal Order: Magician", {
	name : "Primal Order: Magician",
	extraname : "Druid 1",
	source : [["UA23PT8", 8], ["MJ:HB", 0]],
	description : "\n   " + "I know 1 extra cantrip from the Druid spell list & I add my Wis modifier to Intelligence (Nature) checks.",
	spellcastingBonus : [{
		name : "Druid cantrip",
		spellcastingAbility : 5,
		"class" : ["druid", "druid_ua23pt8"],
		level : [0, 0],
		firstCol : "atwill",
		times : 1
	}],
	addMod : [
		{ type : "skill", field : "Nature", mod : "Wis", text : "I can add my Wisdom modifier to Intelligence (Religion) checks." },
	],
	prereqeval : function (v) { return classes.known.druid_ua23pt8.level >= 1 ? true : "skip"; }
}, "1st-level druid Primal Order choice");
AddFeatureChoice(ClassList.druid_ua23pt8.features["primal order ua23pt8"], true, "Primal Order: Warden", {
	name : "Primal Order: Warden",
	extraname : "Druid 1",
	source : [["UA23PT8", 9], ["MJ:HB", 0]],
	description : "\n   " + "I gain Martial Weapons Proficiency & Meduim Armor training.",
	weaponProfs : [false, true],
	armorProfs : [
		[false, true, false, false],
	],
	prereqeval : function (v) { return classes.known.druid_ua23pt8.level >= 1 ? true : "skip"; }
}, "1st-level druid Primal Order choice");

//// Add Druid "Elemental Fury" choices
AddFeatureChoice(ClassList.druid_ua23pt8.features["elemental fury ua23pt8"], true, "Elemental Fury: Potent Spellcasting", {
	name : "Elemental Fury: Potent Spellcasting",
	extraname : "Druid 7",
	source : [["UA23PT8", 10], ["MJ:HB", 0]],
	description : "\n   " + "I add my Wisdom modifier to the damage I deal with my Druid cantrips;" + "\n   " + "At 14th Lvl, Druid cantrips with a range of at least 10 ft increase their range by an additional 300 ft.",
	calcChanges : {
		atkCalc : [
			function (fields, v, output) {
				if (classes.known.druid_ua23pt8 && classes.known.druid_ua23pt8.level > 7 && v.thisWeapon[3] && v.thisWeapon[4].indexOf('druid_ua23pt8') !== -1 && SpellsList[v.thisWeapon[3]].level === 0) {
					output.extraDmg += What('Wis Mod');
				};
			},
			"My Druid cantrips get my Wisdom modifier added to their damage.",
		],
		spellAdd : [
			function (spellKey, spellObj, spName) {
				if (spName.indexOf("druid_ua23pt8") == -1 || !What("Wis Mod") || Number(What("Wis Mod")) <= 0 || spellObj.psionic || spellObj.level !== 0) return;
				return genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", "Wis");
			},
			"My Druid cantrips get my Wisdom modifier added to their damage.",
		],
	},
	prereqeval : function (v) { return classes.known.druid_ua23pt8.level >= 7 ? true : "skip"; }
}, "7th-level druid Elemental Fury choice");
AddFeatureChoice(ClassList.druid_ua23pt8.features["elemental fury ua23pt8"], true, "Elemental Fury: Primal Strike", {
	name : "Elemental Fury: Primal Strike",
	extraname : "Druid 7",
	source : [["UA23PT8", 11], ["MJ:HB", 0]],
	description : "\n   " + "Once per turn, when I hit a creature with a weapon or Beast form's attack in Wild Shape, I can do extra damage;" + "\n   " + "This extra damage consists of 1d8 of my choice of Cold, Fire, Lightning, or Thunder damage; damage increases at 14th Lvl.",
	additional : levels.map(function (n) {
		return n < 7 ? "" : "+" + (n < 14 ? 1 : 2) + "d8 Radiant/Necrotic damage (choice)";
	}),
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (classes.known.druid_ua23pt8 && classes.known.druid_ua23pt8.level >= 7 && !v.isSpell) {
					fields.Description += (fields.Description ? '; ' : '') + 'Once per turn +' + (classes.known.druid_ua23pt8.level < 14 ? 1 : 2) + 'd8 Cold, Fire, Lightning, or Thunder damage';
				}
			},
			"Once per turn, when I hit a creature with a weapon or Beast form's attack in Wild Shape, I can do extra Cold, Fire, Lightning, or Thunder damage.",
		],
	},
	prereqeval : function (v) { return classes.known.druid_ua23pt8.level >= 7 ? true : "skip"; }
}, "7th-level druid Elemental Fury choice");

//// Add Druid optional choices; Ripped directly from "all_WotC_pub+UA.js" and then altered
AddFeatureChoice(ClassList.druid_ua23pt8.features["spellcasting ua23pt8"], true, "Access to Dunamancy Spells", {
	name : "Dunamancy Spells",
	extraname : "Optional Druid 1",
	source : [["W", 186]],
	description : desc([
		"All dunamancy spells are added to the Druid spell list, each still pending DM's approval."
	]),
	calcChanges : {
		spellList : [
			function(spList, spName, spType) {
				// Stop this is not the class' spell list or if this is for a bonus spell entry
				if (spName !== "druid_ua23pt8" || spType.indexOf("bonus") !== -1) return;
				spList.extraspells = spList.extraspells.concat(["sapping sting", "gift of alacrity", "magnify gravity", "fortune's favor", "immovable object", "wristpocket", "pulse wave", "gravity sinkhole", "temporal shunt", "gravity fissure", "tether essence", "dark star", "reality break", "ravenous void", "time ravage"]);
			},
			"This optional class feature expands the spell list of the Druid class with all dunamancy spells (spell level in brackets): Sapping Sting (cantrip), Gift of Alacrity (1), Magnify Gravity (1), Fortune's Favor (2), Immovable Object (2), Wristpocket (2), Pulse Wave (3), Gravity Sinkhole (4), Temporal Shunt (5), Gravity Fissure (6), Tether Essence (7), Dark Star (8), Reality Break (8),Ravenous Void (9), and Time Ravage (9)."
		]
	}
}, "Optional 1st-level druid features");
AddFeatureChoice(ClassList.druid_ua23pt8.features["spellcasting ua23pt8"], true, "Additional Druid Spells", {
	name : "Additional Druid Spells",
	extraname : "Optional Druid 1",
	source : [["T", 35]],
	description : "",
	calcChanges : {
		spellList : [
			function(spList, spName, spType) {
				// Stop this is not the class' spell list or if this is for a bonus spell entry
				if (spName !== "druid_ua23pt8" || spType.indexOf("bonus") !== -1) return;
				spList.extraspells = spList.extraspells.concat(["protection from evil and good", "augury", "continual flame", "enlarge/reduce", "aura of vitality", "elemental weapon", "revivify", "divination", "fire shield", "cone of cold", "flesh to stone", "symbol", "incendiary cloud"]);
			},
			"This optional class feature expands the spell list of the Druid class with the following spells (spell level in brackets): Protection from Evil and Good (1), Augury (2), Continual Flame (2), Enlarge/Reduce (2), Aura of Vitality (3), Elemental Weapon (3), Revivify (3), Divination (4), Fire Shield (4), Cone of Cold (5), Flesh to Stone (6), Symbol (7), and Incendiary Cloud (8)."
		]
	}
}, "Optional 1st-level druid features");

////// Add UA23PT6 Circle of the Land Druid subclass
AddSubClass("druid_ua23pt8", "circle of the land_ua23pt6", { //Ripped directly from "ListsClasses.js" and then heavily altered
	regExpSearch : /^(?=.*druid)(?=.*\b(land|arctic|coast|deserts?|forests?|grasslands?|steppes?|mountains?|swamps?|underdark)\b).*$/i,
	subname : "Circle of the Land",
	source : [["UA23PT6", 21], ["SRD", 21], ["P", 68], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Circle Spells",
			source : [["UA23PT6", 22], ["SRD", 21], ["P", 68], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc('Choose a terrain that grants you spells using the "Choose Feature" button above.'),
			choices : ["Arid", "Polar", "Temperate", "Tropical"],
			"arid" : {
				name : "Arid Circle Spells",
				description : desc([
					"My mystical connection to arid land infuses me with the ability to cast certain spells.",
					"These are always prepared, but don't count against the number of spells I can prepare.",
					"I can change the type of land chosen whenever I finish a Long Rest.",
				]),
				spellcastingExtra : ["blur", "burning hands", "fire bolt", "fireball", "blight", "wall of stone"],
			},
			"polar" : {
				name : "Polar Circle Spells",
				description : desc([
					"My mystical connection to polar land infuses me with the ability to cast certain spells.",
					"These are always prepared, but don't count against the number of spells I can prepare.",
					"I can change the type of land chosen whenever I finish a Long Rest.",
				]),
				spellcastingExtra : ["fog cloud", "hold person", "ray of frost", "sleet storm", "ice storm", "cone of cold"],
			},
			"temperate" : {
				name : "Temperate Circle Spells",
				description : desc([
					"My mystical connection to temperate land infuses me with the ability to cast certain spells.",
					"These are always prepared, but don't count against the number of spells I can prepare.",
					"I can change the type of land chosen whenever I finish a Long Rest.",
				]),
				spellcastingExtra : ["misty step", "shocking grasp", "shocking grasp ua23bc", "sleep", "lightning bolt", "freedom of movement", "tree stride"],
			},
			"tropical" : {
				name : "Tropical Circle Spells",
				description : desc([
					"My mystical connection to tropical land infuses me with the ability to cast certain spells.",
					"These are always prepared, but don't count against the number of spells I can prepare.",
					"I can change the type of land chosen whenever I finish a Long Rest.",
				]),
				spellcastingExtra : ["acid splash", "acid splash ua23bc", "ray of sickness", "web", "stinking cloud", "polymorph", "insect plague"],
			},
			choiceDependencies : [{
				feature : "subclassfeature10"
			}],
		},
		"subcalssfeature3.1" : {
			name : "Land's Aid",
			source : [["UA23PT6", 22], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"As a Magic action, I can expend a use of Wild Shape \u0026 choose a point within 60 ft of myself.",
				"Centered on that point, a 10 ft rad sphere of life-giving flowers \u0026 life-draining thorns appears.",
				"Each creature of my choice in that area must make a Con save. Creatures that fail take 2d6 Necrotic",
				"  damage, half that on a success. 1 creature of my choice in that area regains 2d6 HP.",
				"The damage \u0026 healing are rolled separately, and increase at Druid levels 10 (3d6) \u0026 14 (4d6).",
			]),
			additional : levels.map(function (n) {
				return "+" + (n < 10 ? 2 : n < 14 ? 3 : 4) + "d6 damage \u0026 healing";
			}),
		},
		"subclassfeature6" : {
			name : "Natural Recovery",
			source : [["UA23PT6", 22], ["SRD", 21], ["P", 68], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc([
				"Once per Long Rest, I can cast one of my Circle Spells without expending a spell slot.",
				"After a Short Rest, I can recover a number of 5th-level or lower spell slots.",
				"The spell slots recovered can have a combined lvl that is \u2264 half my Druid lvl (round up).",
			]),
			additional : levels.map(function (n) {
				return Math.ceil(n/2) + " levels of spell slots";
			}),
			usages : 1,
			recovery : "short rest",
		},
		"subclassfeature10" : {
			name : "Nature's Ward",
			source : [["UA23PT6", 22], ["SRD", 22], ["P", 68], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc('Choose a terrain that grants you a Resistance using the "Choose Feature" button above.'),
			choicesNotInMenu : true,
			choices : ["Arid", "Polar", "Temperate", "Tropical"],
			"arid" : {
				name : "Arid Circle Spells",
				description : desc([
					"My mystical bond with arid land protects me.",
					"I am immune to the Poisoned condition \u0026 have Resistance to Fire damage.",
				]),
				savetxt : { immune : ["poisoned"] },
				dmgres : [["Fire"]],
			},
			"polar" : {
				name : "Polar Circle Spells",
				description : desc([
					"My mystical bond with polar land protects me.",
					"I am immune to the Poisoned condition \u0026 have Resistance to Cold damage.",
				]),
				savetxt : { immune : ["poisoned"] },
				dmgres : [["Cold"]],
			},
			"temperate" : {
				name : "Temperate Circle Spells",
				description : desc([
					"My mystical bond with temperate land protects me.",
					"I am immune to the Poisoned condition \u0026 have Resistance to Lightning damage.",
				]),
				savetxt : { immune : ["poisoned"] },
				dmgres : [["Lightning"]],
			},
			"tropical" : {
				name : "Tropical Circle Spells",
				description : desc([
					"My mystical bond with tropical land protects me.",
					"I am immune to the Poisoned condition \u0026 have Resistance to Poison damage.",
				]),
				savetxt : { immune : ["poisoned"] },
				dmgres : [["Poison"]],
			},
		},
		"subclassfeature14" : {
			name : "Nature's Sanctuary",
			source : [["UA23PT6", 22], ["SRD", 22], ["P", 68], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"As a Magic action, I can expend a use of Wild Shape to cause spectral trees \u0026 vines to appear",
				"  in a 15 ft cube on the ground within 120 ft of myself. This cube lasts for 1 min or until I",
				"  am Incapacitated. Myself \u0026 my allies have Half Cover within the cube, \u0026 my allies gain",
				"  the current Resistance of my Nature's Ward while within the cube.",
				"I can use a Bonus Action to move the cube up to 60 ft to another grounded location.",
			]),
		},
	},
});

////// Add UA23PT8 Circle of the Moon Druid subclass
AddSubClass("druid_ua23pt8", "circle of the moon_ua23pt8", { //Ripped directly from "all_WotC_pub+UA.js" and then altered
	regExpSearch : /^(?=.*druid)((?=.*\bmoon\b)|((?=.*\bmany\b)(?=.*\bforms?\b))).*$/i,
	subname : "Circle of the Moon",
	source : [["UA23PT8", 11], ["P", 69], ["MJ:HB", 0]],
	spellcastingExtra : ["cure wounds", "cure wounds ua23pt8", "moonbeam", "starry wisp ua23pt8", "vampiric touch", "fount of moonlight ua23pt8", "dawn"],
	features : {
		"subclassfeature2.wild shape" : {
			name : "Wild Shape",
			source : [["UA23PT8", 12], ["P", 66], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"As a Bonus Action, I assume the shape of a Beast I have seen before with the following rules:",
				" \u2022 I gain all its game statistics except HD, HP, Int, Wis, Cha, \u0026 Proficiency Bonus;",
				" \u2022 I retain class features, languages, \u0026 feats, but I don't retain special senses;",
				" \u2022 I also retain my personality, memories, \u0026 ability to speak;",
				" \u2022 I keep my skill/saving throw prof.; if it has the same prof, I use whichever bonus is higher;",
				" \u2022 I can't cast spells in Beast form, but transforming doesn't break Concentration;",
				" \u2022 I can choose whether equipment falls to the ground, merges, or stays worn;",
				" \u2022 I gain Temp HP equal to thrice my Druid level; My AC = 13 + Wis mod;",
				"I revert by running out of time, using Wild Shape again, or using a Bonus Action to end it.",
				"I regain one expended use of Wild Shape when I finish a Short Rest.",
				"I know a number of forms equal to 2 + half my Druid lvl (round up).",
			]),
			usages : [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, "\u221E\xD7 per "],
			recovery : "long rest",
			additional : levels.map(function (n) {
				if (n < 2) return "";
				var frms = 2 + Math.ceil(n/2);
				var cr = Math.max(1, Math.floor(n/3));
				var hr = Math.floor(n/2);
				var restr = n < 8 ? ", no Fly" : "";
				var temphp = Math.floor(n*3);
				return frms + " forms known; CR " + cr + restr + "; " + hr + (restr.length ? " h" : " hours") + "; " + temphp + " Temp HP";
			}),
			limfeaname : "Wild Shape",
			action : ["bonus action", " (start/end)"],
			eval : function() {
				processActions(false, "Druid: Wild Shape", ClassList.druid_ua23pt8.features["subclassfeature2.wild shape"].action, "Wild Shape");
			},
		},
		"subclassfeature3" : {
			name : "Circle Forms",
			source : [["UA23PT8", 12], ["P", 69], ["MJ:HB", 0]],
			minlevel : 3,
			description : "\n   " + "I am able to transform into more dangerous animal forms when using Wild Shape."
		},
		"subclassfeature6" : {
			name : "Improved Circle Forms", //This completely replaces "Primal Strike"
			source : [["UA23PT8", 12], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc([
				"While in Wild Shape, my attacks can deal either their normal damage type or Radiant damage;",
				"  This choice is made each time I hit.",
				"While in Wild Shape, I can add my Wisdom modifier to my Constitution saving throws.",
			]),
		},
		"subclassfeature10" : {
			name : "Moonlight Step", //This completely replaces "Elemental Wild Shape"
			source : [["UA23PT8", 12], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc([
				"As a Bonus Action, I can teleport myself up to 30 ft to an unoccupied space I can see.",
				"Doing so grants me Adv. on my next attack roll before the end of this turn.",
				"I can do this Wis mod number of times per Long Rest; I can also expend a 2nd-lvl or higher",
				"  spell slot to regain a use of this feature.",
			]),
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			altResource : "SS 2+",
			action : ["bonus action", ""],
		},
		"subclassfeature14" : {
			name : "Lunar Form", //This completely replaces "Thousand Forms"
			source : [["UA23PT8", 12], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"Each of my attacks in Wild Shape form deal an extra 1d10 Radiant damage.",
				"When I use Moonlight Step, I can also teleport 1 willing creature; This creature must be within",
				"  10 ft of me, and they will arrive within 10 ft of my destination.",
			]),
		},
	},
});

////// Add UA23PT6 Circle of the Sea Druid subclass; Introduced as a part of the One D&D/5.1E Playtests
AddSubClass("druid_ua23pt8", "circle of the sea_ua23pt6", {
	regExpSearch : /^(?=.*druid)(?=.*\b(sea|ocean|water)\b).*$/i,
	subname : "Circle of the Sea",
	source : [["UA23PT6", 24], ["MJ:HB", 0]],
	spellcastingExtra : ["fog cloud", "gust of wind", "ray of frost", "shatter", "thunderwave", "sleet storm", "lightning bolt", "control water", "ice storm", "conjure elemental", "conjure elemental ua23pt8", "hold monster"],
	features : {
		"subclassfeature3" : {
			name : "Wrath of the Sea",
			source : [["UA23PT6", 24], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"As a Bonus Action, I can expend a use of Wild Shape to manifest an aura of ocean spray around me.",
				"The aura lasts for 10 min, \u0026 ends early if I become Incapacitated, dismiss it, or manifest it again.",
				"At the end of each of my turns, I can force creatures of my choice within 10 ft of me to make a",
				"  Con save or take Thunder damage \u0026, if it is Large or smaller, be pushed up to 15 ft away from me.",
				"The damage taken is my Wis mod number of d6s (minimum of 1).",
			]),
		},
		"subclassfeature6" : {
			name : "Aquatic Affinity",
			source : [["UA23PT6", 24], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc([
				"I always have the Water Breathing spell prepared, \u0026 I gain a Swim Speed equal to my Speed.",
				"Wild Shape forms that normally don't have a Swim Speed now gain my Swim Speed.",
			]),
			speed : { swim : { spd : "walk", enc : "walk" } },
		},
		"subclassfeature10" : {
			name : "Stormborn",
			source : [["UA23PT6", 24], ["MJ:HB", 0]],
			minlevel : 10,
			description : desc([
				"I gain a Fly Speed equal to my Speed, and I gain Resistance to Cold, Lightning, /u0026 Thunder dmg.",
			]),
			speed : { fly : { spd : "walk", enc : "walk" } },
			dmgres : [["Cold"], ["Lightning"], ["Thunder"]],
		},
		"subclassfeature14" : {
			name : "Oceanic Gift",
			source : [["UA23PT6", 24], ["MJ:HB", 0]],
			minlevel : 14,
			description : desc([
				"When I use Wrath of the Sea, I can manifest the aura around 1 willing creature within 60 ft of",
				"  of me rather than manifesting it around myself.",
				"The creature gains all the benefits of the aura, uses my Spell Save DC, \u0026 my Wis mod for the aura.",
				"I can manifest the aura around both myself \u0026 the creature by expending 2 Wild Shape uses.",
			]),
		},
	},
});

// Add UA23PT8 Monk class; code by user @Nod; altered to conform to MasterJedi2014's source referencing scheme, but otherwise left unaltered
ClassList.monkua = {
	regExpSearch : /^((?=.*monk)|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
	name : "Monk (UA:PT-viii)",
	source : [["UA23PT8", 13], ["UAM"]],
	primaryAbility : "Dexterity and Wisdom",
	abilitySave : 5,
	prereqs : "Dexterity 13 and Wisdom 13",
	die : 8,
	improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves : ["Str", "Dex"],
	toolProfs : { primary : [["Artisan's tool or musical instrument", 1]] },
	skillstxt : { primary : "Choose two from Acrobatics, Athletics, History, Insight, Religion, and Stealth" },
	armorProfs : { primary : [false, false, false, false] },
	weaponProfs : {
		primary : [true, false, ["hand crossbow","scimitar","shortsword"]],
		secondary : [true, false, ["hand crossbow","scimitar","shortsword"]]
	},
	equipment : "Monk starting equipment:" +
		"\n \u2022 Artisan's Tools" +
		"\n \u2022 Musical Instrument" +
		"\n \u2022 5 daggers" +
		"\n \u2022 A spear" +
		"\n \u2022 An explorer's pack" +
		"\n\nAlternatively, choose 65 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
	subclasses : ["Monastic Tradition", []],
	attacks : [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	features : {
	"unarmored defense" : {
		name : "Unarmored Defense",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 1,
		description : desc("Without armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier"),
		armorOptions : [{
			regExpSearch : /justToAddToDropDown/,
			name : "Unarmored Defense (Wis)",
			source : [["UAM"]],
			ac : "10+Wis",
			affectsWildShape : true
		}],
		armorAdd : "Unarmored Defense (Wis)"
	},
	"martial arts" : {
		name : "Martial Arts",
		source : [["UA23PT8", 14], ["UAM"]],
		minlevel : 1,
		description : desc([
			"Monk weapons are any simple melee and Light property martial weapons. With unarmed",
			"strikes and monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
			"In addition, when I Grapple or Shove, I can use my Dex modifier to determine the save DC"
		]),
		additional : levels.map(function (n) {
			return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
		}),
		action : [["bonus action", "Unarmed Strike"]],
		eval : function() {
			AddString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
			show3rdPageNotes();
		},
		removeeval : function() {
			RemoveString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
		},
		calcChanges : {
		atkAdd : [ function (fields, v) {
				if (classes.known.monkua && classes.known.monkua.level && (v.theWea.monkweapon || v.baseWeaponName == "unarmed strike" || (/hand crossbow|scimitar|shortsword/i).test(v.baseWeaponName) || (v.isMeleeWeapon && (/simple/i).test(v.theWea.type) ))) {
					v.theWea.monkweapon = true;
					var aMonkDie = function (n) { return n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12; }(classes.known.monkua.level);
					try {
						var curDie = eval_ish(fields.Damage_Die.replace('d', '*'));
					} catch (e) {
						var curDie = 'x';
					};
					if (isNaN(curDie) || curDie < aMonkDie) {
						fields.Damage_Die = '1d' + aMonkDie;
					};
					if (fields.Mod == 1 || fields.Mod == 2 || What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod")) {
						fields.Mod = v.StrDex;
					}
				};
			},
			"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include any simple melee, unarmed strike, and martial weapons with Light property",
			]
		}
	},
	"monk's discipline" : {
		name : "Monk's Discipline",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 2,
		description : desc(["I can spend discipline points to fuel special actions (see third page)"]),
		limfeaname : "Discipline Points",
		usages : levels.map(function (n) { return n < 2 ? "" : n }),
		recovery : "short rest",
	"flurry of blows" : {
		name : "Flurry of Blows",
		extraname : "Discipline Feature",
		source : [["UA23PT8", 15], ["UAM"]],
		description : levels.map(function (n) {
			return desc("I can make " + (n < 10 ? 2 : 3) + " unarmed strikes as a bonus action");
		}),
		additional : ["1 discipline point"],
		action : ["bonus action", ""]
	},
	"patient defense" : {
		name : "Patient Defense",
		extraname : "Discipline Feature",
		source : [["UA23PT8", 15], ["UAM"]],
		description : levels.map(function (n) {
		return n < 2 ? "" : "\n   As a bonus action, I can take the Disengage action. Alternatively, I can spend 1 discipline \n   point to take both the Disengage and Dodge actions" + (n < 6 ? "" : "\n   When I spend a discipline point, I gain 2 martial arts die rolls of temp HP");
		}),
		additional : [ "", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP", "optional-1 discipline point; +2 martial arts die THP"],
		action : ["bonus action", ""]
	},
	"step of the wind" : {
		name : "Step of the Wind",
		extraname : "Discipline Feature",
		source : [["UA23PT8", 15], ["UAM"]],
		description : levels.map(function (n) {
			return n < 2 ? "" : "\n   As a bonus action, I can take the Dash action. Alternatively, I can spend 1 discipline point to\n   take both the Dash and Disengage actions and my jump distance doubles for the turn" + (n < 6 ? "" : "\n   When I spend a discipline point, I can bring a willing Large or smaller creature within 5 feet\n   of me. The creature’s move doesn’t provoke Opportunity Attacks");
		}),
		additional : ["optional-1 discipline point"],
		action : ["bonus action", ""],
	},
	autoSelectExtrachoices : [{
		extrachoice : "flurry of blows"
	}, {
		extrachoice : "patient defense"
	}, {
		extrachoice : "step of the wind"
	}]
	},
	"unarmored movement" : {
		name : "Unarmored Movement",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 2,
		description : desc("Speed increases and eventually lets me traverse some surfaces without falling as I move"),
		additional : levels.map(function (n) {
			if (n < 2) return "";
			var spd = "+" + (n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30) + " ft";
			var xtr = n < 9 ? "" : "; Vertical surfaces and liquids";
			return spd + xtr;
		}),
		changeeval : function (v) {
			var monkSpd = '+' + (v[1] < 2 ? 0 : v[1] < 6 ? 10 : v[1] < 10 ? 15 : v[1] < 14 ? 20 : v[1] < 18 ? 25 : 30);
			SetProf('speed', monkSpd !== '+0', {allModes : monkSpd}, "Monk: Unarmored Movement");
		}
	},
	"uncanny metabolism" : {
		name : "Uncanny Metabolism",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 2,
		description : desc(["When I roll Initiative, I can regain all expended discipline points. When I do so, I regain a",
		"number of Hit Points equal to my Monk level plus a roll of my Martial Arts die" ]),
		usages : 1,
		recovery : "long rest",
	},
	"subclassfeature3" : {
		name : "Monk Subclass",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 3,
		description : desc('Choose a Monk Subclass to commit to and put it in the "Class" field ')
	},
	"deflect attacks" : {
		name : "Deflect Attacks",
		source : [["UA23PT8", 15], ["UAM"]],
		minlevel : 3,
		description : levels.map(function (n) { return desc([ 
		"As a reaction, I can reduce melee/ranged attacks that deal me " + (n < 13 ? 'Bludg/Pierc/Slash' : 'non-Force') + " dmg",
		"If dmg negated, I can spend 1 discipline point to choose a creature within 5 ft if melee attack",
		"or 60 ft not behind Total Cover if ranged attack. Creature must pass Dex save or take two",
		"rolls of my Martial Arts die + my Dex mod dmg of same type dealt by original attack" ]);
		}),
		additional : levels.map(function (n) { return n < 3 ? "" : "1d10 + " + n + " + Dex mod; 1 discipline point to redirect"; }),
		action : ["reaction", ""],
	},
	"slow fall" : {
		name : "Slow Fall",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 4,
		description : desc("As a reaction, I can reduce any falling damage I take by five times my monk level"),
		additional : levels.map(function (n) { return n < 4 ? "" : (n*5) + " less falling damage" }),
		action : ["reaction", ""],
	"stunning strike" : {
		name : "Stunning Strike",
		extraname : "Monk 5",
		source : [["UA23PT8", 16], ["UAM"]],
		description : " [1/turn, 1 discipline point]" + desc([
			"I can spend a discipline point after I hit a creature with a monk weapon or unarmed strike to",
			"try to stun it. It has to succeed on a Con save or be stunned until the start of my next turn.",
			"On a successful save, the target takes my Wis mod + a roll of my Martial Arts die force dmg" ])
		},
		autoSelectExtrachoices : [{
			extrachoice : "stunning strike",
			minlevel : 5
		}]
	},
	"empowered strikes" : {
		name : "Empowered Strikes",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 6,
		description : desc("My unarmed strikes can deal force damage instead of their regular type"),
		calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (v.baseWeaponName == "unarmed strike" && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description)) {
					fields.Description += (fields.Description ? '; ' : '') + 'Can deal force dmg; ';
				};
			},
			"My unarmed strikes can deal force damage instead of their regular type"
		]}
	},
	"evasion" : {
		name : "Evasion",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 7,
		description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
		savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
	},
	"heightened discipline" : {
		name : "Heightened Discipline",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 10,
		description : desc("My Flurry of Blows, Patient Defense, and Step of the Wind gain additional benefits"),
	},
	"self-restoration" : {
		name : "Self-Restoration",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 10,
		description : desc([
			"At the end of my turn, I can end one charmed, frightened, or poisoned condition on me",
			"In addition, forgoing food and drink doesn’t give me levels of Exhaustion." ]),
	},
	"deflect energy" : {
		name : "Deflect Energy",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 13,
		description : desc("I can use my Deflect Attacks feature against attacks that deal any damage type.")
	},
	"disciplined survivor" : {
		name : "Disciplined Survivor",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 14,
		description : desc("I am proficient with all saves; I can re-roll a failed save once by spending 1 discipline point"),
		additional : "1 discipline point to re-roll failed saving throw",
		saves : ["Str", "Dex", "Con", "Int", "Wis", "Cha"]
	},
	"perfect discipline" : {
		name : "Perfect Discipline",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 15,
		description : desc("When I roll Initiative with less than 4 discipline points, I gain discipline points until I have 4")
	},
	"superior defense" : {
		name : "Superior Defense",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 18,
		description : " [1 minute or until I am Incapacitated]" + desc("I can spend 3 discipline points at the start of my turn for resistance to all non-Force damage"),
	},
	"body and mind" : {
		name : "Body and Mind",
		source : [["UA23PT8", 16], ["UAM"]],
		minlevel : 20,
		description : desc("I add +4 to both my Dexterity and Wisdom, and their maximums increase to 26"),
		scores : [0,4,0,0,4,0],
		scoresMaximum : [0,26,0,0,26,0]
	}}
};

//// Add Monk optional choices; code by user @Nod
AddFeatureChoice(ClassList.monkua.features["monk's discipline"], true, "Dedicated Weapon", {
	name : "Dedicated Weapon",
	extraname : "Optional Monk 2",
	source : [["UAM"]],
	description : desc([
		"When I finish a short or long rest, I can focus and touch one simple or martial weapon",
		"From then on, until I use this feature again, this weapon counts as a monk weapon for me",
		"I have to be proficient with the weapon and it can't have the heavy or special property"
	]),
	calcChanges : {
		atkAdd : [
			function (fields, v) {
				if (!v.theWea.monkweapon && !v.theWea.special && classes.known.monkua && classes.known.monkua.level && (/dedicated/i).test(v.WeaponTextName) && fields.Proficiency && (/simple|martial/i).test(v.theWea.type) && !(/\b(heavy|special)\b/i).test(fields.Description)) {
					v.theWea.monkweapon = true;
				};
			},
			'If I include the word "Dedicated" in the name of a simple or martial weapon that I\'m proficient with and that doesn\'t have the heavy or special property, it will be treated as a monk weapon.',
			1
		]
	}
}, "Optional 2nd-level monk features");
AddFeatureChoice(ClassList.monkua.features["unarmored movement"], true, "Discipline-Fueled Attack", {
	name : "Discipline-Fueled Attack",
	extraname : "Optional Monk 3",
	source : [["UAM"]],
	description : desc([
		"If I use any discipline points during my action on my turn, I can make an unarmed strike or",
		"monk weapon attack as a bonus action in the same turn" ]),
	action : [["bonus action", ""]],
	prereqeval : function (v) { return classes.known.monkua.level >= 3 ? true : "skip"; }
}, "Optional 3rd-level monk features");
AddFeatureChoice(ClassList.monkua.features["deflect attacks"], true, "Quickened Healing (2 discipline points)", {
	name : "Quickened Healing",
	extraname : "Optional Monk 4",
	source : [["UAM"]],
	description : " [2 discipline points]\n   As an action, I can regain HP equal to the roll of my martial arts die + Proficiency Bonus",
	action : [["action", ""]],
	prereqeval : function (v) { return classes.known.monkua.level >= 4 ? true : "skip"; }
}, "Optional 4th-level monk features");
AddFeatureChoice(ClassList.monkua.features["slow fall"], true, "Focused Aim (1-3 discipline points)", {
	name : "Focused Aim",
	extraname : "Optional Monk 5",
	source : [["UAM"]],
	description : " [1-3 discipline points]\n   When I miss an attack roll, I can increase the roll by +2 per discipline point (max +6)",
	prereqeval : function (v) { return classes.known.monkua.level >= 5 ? true : "skip"; }
}, "Optional 5th-level monk features");

////// Add UA23PT6 Warrior of Shadow Monk subclass
AddSubClass("monkua", "warrior of shadow_ua23pt6", { //Ripped directly from "all_WotC_pub+UA.js" and then altered
	regExpSearch : /^(?=.*shadow)((?=.*monk)|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
	subname : "Warrior of Shadow",
	source : [["UA23PT6", 29], ["P", 80], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Shadow Arts",
			source : [["UA23PT6", 29], ["P", 80], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"I know the Minor Illusion cantrip and can cast Darkness by using 1 discipline point.",
				"I don't require spell components to cast Darkness, just discipline points.",
				"I can see within the spell's area when I cast it with this feature, \u0026 while the spell persists,",
				"  at the start of each of my turns, I can move its area of darkness to a space within 60 ft of me.",
				"I gain 60 ft of Darkvision; If I already have Darkvision, its range increases by 60 ft.",
			]),
			additional : "[1 discipline point]",
			vision : [
				["Darkvision", "+60"],
			],
			spellcastingBonus : {
				name : "Shadow Arts",
				spells : ["minor illusion"],
				selection : ["minor illusion"],
				firstCol : "atwill",
			},
			spellFirstColTitle : "Discipline Points",
			"shadow spells" : {
				name : "Shadow Arts",
				source : [["UA23PT6", 29], ["P", 80], ["MJ:HB", 0]],
				description : " [1 discipline point]" + "\n   " + "As an action, I can cast Darkness without spell components, just 1 discipline point",
				action : ["action", ""],
				spellcastingBonus : {
					name : "Shadow Arts",
					spells : ["darkness"],
					selection : ["darkness"],
					firstCol : 1,
				},
			},
			spellChanges : {
				"darkness" : {
					components : "",
					compMaterial : "",
					changes : "Spell cast with my Shadow Arts don't require spell components."
				},
			},
		},
		"subclassfeature6" : {
			name : "Shadow Step",
			source : [["UA23PT6", 29], ["P", 80]],
			minlevel : 6,
			description : desc([
				"As a Bonus Action, I can teleport from and into Dim Light or Darkness within 60 ft.",
				"After I do this, I have Adv. on the next melee attack I make before the end of my turn.",
			]),
			action : ["bonus action", ""],
		},
		"subclassfeature11" : {
			name : "Improved Shadow Step",
			source : [["UA23PT6", 29], ["P", 80], ["MJ:HB", 0]],
			minlevel : 11,
			description : desc([
				"When I use Shadow Step, I can spend 1 Disciple Point to remove the requirement that I must start",
				"  end in Dim Light or Darkness for the use of that feature.",
				"As part of this Bonus Action, I can make an Unarmed Strike immediately after the teleportation.",
			]),
			additional : "[1 discipline point]",
		},
		"subclassfeature17" : {
			name : "Cloak of Shadows",
			source : [["UA23PT6", 29], ["P", 80], ["MJ:HB", 0]],
			minlevel : 17,
			description : desc([
				"As a Bonus Action while entirely within Dim Light or Darkness, I can spend 3 Discipline Points to",
				"  shroud myself with magical darkness for 1 min, until I become Incapacitated, or until I end my",
				"  turn in Bright Light. While shrouded in darkness, I gain the following benefits:",
				" \u2022 I have the Invisible condition.",
				" \u2022 I can move through creatures/objects as if they were Difficult Terrain, but I take 1d10",
				"  Force damage if I end my turn inside a creature or an object.",
				" \u2022 I can use my Flurry of Blows without spending any Discipline Points.",
			]),
			action : ["bonus action", ""]
		},
	},
});

////// Add UA23PT6 Warrior of the Elements Monk subclass
AddSubClass("monkua", "warrior of the elements_ua23pt6", { //Ripped directly from "all_WotC_pub+UA.js" and then heavily altered
	regExpSearch : /^(?=.*\b(four|4)\b)((?=.*elements?)|((?=.*earth)|(?=.*(wind|air))|(?=.*fire)|(?=.*water)))((?=.*(monk|monastic))|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
	subname : "Warrior of the Elements",
	source : [["UA23PT6", 30], ["P", 80], ["MJ:HB", 0]],
	spellcastingExtra : ["elementalism ua23pt6"],
	features : {
		"subclassfeature3" : {
			name : "Elemental Attunement (Formerly 'Disciple of the Elements')",
			source : [["UA23PT6", 30], ["P", 80], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"I know the Elementalism cantrip. At the start of my turn, I can spend 1 Discipline Point to",
				"  imbue myself with elemental energy that lasts for 10 minutes or until I become Incapacitated.",
				"While imbued with elemental energy, I gain the following benefits:",
				" \u2022 My Unarmed Strikes can deal Acid, Cold, Fire, or Lightning dmg instead of Bludg.",
				"  I can also force the target to make a Str save or be moved 10 ft toward or away from me.",
				" \u2022 My Unarmed Strikes now have a reach of 15 ft instead of 5 ft.",
				"Adding the word 'Acid', 'Cold', 'Fire', or 'Lightning' in the name of an Unarmed Strike applies",
				"  the above effects to that Unarmed Strike.",
			]),
			additional : "[1 discipline point]",
			calcChanges : {
				atkAdd : [
					function (fields, v) {
						if (v.baseWeaponName == "unarmed strike" && (/^(?=.*acid).*$/i).test(v.WeaponTextName)) {
							fields.Description += (fields.Description ? '; ' : '') + 'While Elemental Attunment is running, I deal Acid dmg, and if target fails Str save, can move target up to 10 ft';
							fields.Range = 'Melee (15 ft reach)';
							fields.Damage_Type = 'acid';
						}
						if (v.baseWeaponName == "unarmed strike" && (/^(?=.*cold).*$/i).test(v.WeaponTextName)) {
							fields.Description += (fields.Description ? '; ' : '') + 'While Elemental Attunment is running, I can deal Cold dmg, and if target fails Str save, can move target up to 10 ft';
							fields.Range = 'Melee (15 ft reach)';
							fields.Damage_Type = 'cold';
						}
						if (v.baseWeaponName == "unarmed strike" && (/^(?=.*fire).*$/i).test(v.WeaponTextName)) {
							fields.Description += (fields.Description ? '; ' : '') + 'While Elemental Attunment is running, I can deal Fire dmg, and if target fails Str save, can move target up to 10 ft';
							fields.Range = 'Melee (15 ft reach)';
							fields.Damage_Type = 'fire';
						}
						if (v.baseWeaponName == "unarmed strike" && (/^(?=.*lightning).*$/i).test(v.WeaponTextName)) {
							fields.Description += (fields.Description ? '; ' : '') + 'While Elemental Attunment is running, I can deal Lightning dmg, and if target fails Str save, can move target up to 10 ft';
							fields.Range = 'Melee (15 ft reach)';
							fields.Damage_Type = 'lightning';
						}
					},
					"If I include the word 'Acid', 'Cold', 'Fire', or 'Lightning' in the name of an Unarmed Strike, it gets +10 ft reach, and does the corresponding damage.",
				]
			},
		},
		"subclassfeature6" : {
			name : "Environmental Burst",
			source : [["UA23PT6", 30], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc([
				"As a Magic action, I can spend 2 Discipline Points to cause a burst of elemental energy.",
				"This burst is a 20 ft rad sphere that can be centered on a point within 120 ft of myself.",
				"Each creature in the sphere must make a Dex save. On a fail, they take damage equal to 3 rolls",
				"  of my Martial Arts die. On a success, they take half as much damage.",
				"All creatures within the sphere take my choice of Acid, Cold, Fire, or Lightning damage.",
				"Before or after I take this action, I can use my Bonus Action to make one Unarmed Strike.",
			]),
			additional : "[2 discipline points]",
			action : ["action", ""]
		},
		"subclassfeature11" : {
			name : "Stride of the Elements",
			source : [["UA23PT6", 30], ["MJ:HB", 0]],
			minlevel : 11,
			description : desc([
				"When I use my Step of the Wind, I gain a Fly Speed \u0026 Swim Speed equal to my Speed for 10 min.",
			]),
		},
		"subclassfeature17" : {
			name : "Elemental Epitome",
			source : [["UA23PT6", 30], ["MJ:HB", 0]],
			minlevel : 17,
			description : desc([
				"When I use my Elemental Attunment feature, I also gain the following benefits for the duration:",
				" \u2022 I gain Resistance to one of the following damage types, and can change which I have at",
				"  the start of each of my turns: Acid, Cold, Fire, or Lightning.",
				" \u2022 When I use my Step of the Wind, my Speed increases by 20 ft until the end of the turn;",
				"  For that duration, any creature of my choice that I enter within 5 ft of takes 1 of my Martial",
				"  Arts die in damage of the type that I have chosen to have Resistance for with this feature.",
				" \u2022 Once per turn, I can deal extra damage to a target equal to 1 roll of my Martial Arts",
				"  die when I hit with an Unarmed Strike. The damage is the same type you chose for this feature’s",
				"  damage Resistance.",
			]),
		},
	},
});

////// Add UA23PT8 Warrior of the Hand Monk subclass
AddSubClass("monkua", "warrior of the hand_ua23pt8", { //Ripped directly from "ListsClasses.js" and then altered
	regExpSearch : /^(?=.*\bopen\b)(?=.*\bhand\b)((?=.*monk)|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
	subname : "Warrior of the Open Hand",
	source : [["UA23PT8", 17], ["SRD", 28], ["P", 79], ["MJ:HB", 0]],
	features : {
		"subclassfeature3" : {
			name : "Open Hand Technique",
			source : [["UA23PT8", 17], ["SRD", 28], ["P", 79], ["MJ:HB", 0]],
			minlevel : 3,
			description : desc([
				"Whenever I hit a creature with a Flurry of Blows attack I can do one of the following:",
				" \u2022 Have it make a Dexterity save or be knocked Prone.",
				" \u2022 Have it make a Strength save or be pushed up to 15 ft away from me.",
				" \u2022 Stop it from taking Opportunity Attacks until the start of its next turn.",
			]),
		},
		"subclassfeature6" : {
			name : "Wholeness of Body",
			source : [["UA23PT8", 17], ["SRD", 28], ["P", 79], ["MJ:HB", 0]],
			minlevel : 6,
			description : desc("As a Bonus Action, I regain HP equal my Martial Arts die + my Wis mod (min 1 HP regained)."),
			usages : "Wisdom modifier per ",
			usagescalc : "event.value = Math.max(1, What('Wis Mod'));",
			recovery : "long rest",
			action : ["bonus action", ""],
		},
		"subclassfeature11" : {
			name : "Fleet Step",
			source : [["UA23PT8", 17], ["MJ:HB", 0]],
			minlevel : 11,
			description : desc([
				"I use Step of the Wind when I take any other Bonus Action.",
			]),
		},
		"subclassfeature17" : {
			name : "Quivering Palm",
			source : [["UA23PT8", 17], ["SRD", 29], ["P", 80], ["MJ:HB", 0]],
			minlevel : 17,
			description : desc([
				"When I hit a creature with an Unarmed Strike, I can start imperceptible vibrations at the listed cost.",
				"Within my Monk level in days, I can use an action to have the creature make a Con save.",
				"If it fails, it takes 10d12 Force damage; If it succeeds, it takes half that.",
				"I can only cause this damage if myself \u0026 the target are on the same plane of existence.",
				"I can only have 1 creature under this effect at a time.",
				"I can end the vibrations harmlessly without using an action.",
			]),
			additional : "[4 discipline point]",
		},
	},
});

// Add UA23PT8 Spells
SpellsList["conjure animals ua23pt8"] = {
	name : "Conjure Animals (UA23PT8)",
	source : [["UA23PT8", 18], ["P", 225], ["MJ:HB", 0]],
	classes : ["druid", "druid_ua23pt8", "ranger", "ranger_ua23pt6"],
	level : 3,
	school : "Conj",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V,S",
	duration : "Conc, 10 m",
	description : "Summon Large swarm of spectral animals; atk those enter within 10 ft of swarm for 2d10+spellcasting ability modifier Rad dmg; See bk",
	descriptionFull : "You summon nature spirits that take the form of a Large swarm of spectral animals in an unoccupied space that you can see within range. The swarm lasts for the duration, and you choose the animal form of the spirits, such as wolves, serpents, or birds." + "\n   " + "When a creature hostile to you enters a space within 10 feet of the swarm for the first time on a turn or starts its turn there, you can make a melee spell attack against that creature. On a hit, the target takes Radiant damage equal to 2d10 plus your spellcasting ability modifier." + "\n   " + "You have Advantage on Strength saving throws while you’re within 10 feet of the swarm, and when you Move on your turn, you can also move the swarm up to 30 feet to an unoccupied space you can see." + AtHigherLevels + "When you cast this spell using a spell slot of level 4 or higher, the damage increases by 1d10 for each slot level above 3.",
};
SpellsList["conjure celestial ua23pt8"] = {
	name : "Conjure Celestial (UA23PT8)",
	source : [["UA23PT8", 18], ["P", 225], ["MJ:HB", 0]],
	classes : ["cleric", "cleric_ua23pt6"],
	level : 7,
	school : "Conj",
	time : "1 a",
	range : "90 ft",
	rangeMetric : "27 m",
	components : "V,S",
	duration : "Conc, 10 m",
	save : "Dex",
	description : "10 ft rad, 40 ft high cylinder; move when I move; heal 4d12+spellcasting ability modifier; 8d12 Rad dmg on fail, half on success; See bk",
	descriptionFull : "You summon the protective presence of a Celestial spirit, which manifests as a pillar of divine light that shines in a 10-foot-radius, 40- foot-high Cylinder centered on a point within range. Until the spell ends, Bright Light fills the Cylinder, and when you Move on your turn, you can also move the Cylinder up to 30 feet." + "\n   " + "When a creature enters the Cylinder for the first time on a turn or starts its turn there, you can bathe that creature in one of the following lights:" + "\n   " + "Healing Light. The creature that isn’t an Undead or a Construct regains Hit Points equal to 4d12 plus your spellcasting modifier. A creature can be healed by this light only once per casting of this spell." + "\n   " + "Searing Radiance. The creature must make a Dexterity saving throw, taking 8d12 Radiant damage on a failed save or half as much damage on a successful one." + AtHigherLevels + "When you cast this spell using a spell slot of level 8 or higher, the healing and damage increase by 1d12 for each slot level above 7.",
};
SpellsList["conjure elemental ua23pt8"] = {
	name : "Conjure Elemental (UA23PT8)",
	source : [["UA23PT8", 19], ["P", 225], ["MJ:HB", 0]],
	classes : ["druid", "druid_ua23pt8", "wizard", "wizard_ua23pt7"],
	level : 5,
	school : "Conj",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V,S",
	duration : "Conc, 10 m",
	save : "Str",
	description : "Elemental spirit fill 10 ft cube; atk those that come within 5 ft of the spirit for 8d8 dmg; See bk",
	descriptionFull : "You summon an Elemental spirit that fills a 10- foot Cube within range. The spirit lasts for the duration and is composed of air, earth, fire, or water (your choice) when you cast this spell." + "\n   " + "When a creature hostile to you Moves within 5 feet of the spirit, you can make a melee spell attack against that creature. On a hit, the target takes 8d8 damage of a type determined by the spirit’s element: Bludgeoning (earth), Cold (water), Fire (fire), or Lightning (air). If the target is a Large or smaller creature, it is also pulled into the Cube and has the Restrained condition. At the start of each of its turns, the target must make a Strength saving throw against your spell save DC. On a success, the target frees itself. On a failure, the target takes 4d8 damage of the same type as the spell attack. The spirit can have only one creature restrained at a time." + AtHigherLevels + "When you cast this spell using a spell slot of level 6 or higher, the damage increases by 2d8 for each slot level above 5.",
};
SpellsList["conjure fey ua23pt8"] = {
	name : "Conjure Fey (UA23PT8)",
	source : [["UA23PT8", 19], ["P", 226], ["MJ:HB", 0]],
	classes : ["druid", "druid_ua23pt8"],
	level : 6,
	school : "Conj",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V,S",
	duration : "Conc, 10 m",
	save : "Wis",
	description : "Medium Fey spirit; spell atks for 3d12+spellcasting ability modifier Psychic; save or Frightened until start of my next turn; See bk",
	descriptionFull : "You summon the awesome presence of a Medium Fey spirit in an unoccupied space you can see within range. The spirit lasts for the duration, and it looks like a Fey creature of your choice. When the spirit appears, you can immediately make one melee spell attack against a creature within 5 feet of the spirit. On a hit, the target takes Psychic damage equal to 3d12 plus your spellcasting ability modifier, and the target must succeed on a Wisdom saving throw or have the Frightened condition until the start of your next turn." + "\n   " + "As a Bonus Action on your later turns, you can teleport the spirit to an unoccupied space you can see within 30 feet of the space it left and repeat the attack against a creature within 5 feet of it." + AtHigherLevels + "When you cast this spell using a spell slot of level 7 or higher, the damage increases by 2d12 for each slot level above 6.",
};
SpellsList["conjure minor elementals ua23pt8"] = {
	name : "Conjure Minor Elementals (UA23PT8)",
	source : [["UA23PT8", 19], ["P", 226], ["MJ:HB", 0]],
	classes : ["druid", "druid_ua23pt8", "wizard", "wizard_ua23pt7"],
	level : 4,
	school : "Conj",
	time : "1 a",
	range : "S:15" + (typePF ? "-" : "") + "ft rad",
	rangeMetric : "S:4.5m rad",
	components : "V,S",
	duration : "Conc, 10 m",
	description : "Atks within 15 ft deal +2d8+2d8/SL Bludg/Cold/Fire/Lghtng dmg; Ground within 15 ft Difficult Terrain",
	descriptionFull : "You summon elemental spirits that a flit around you for the duration. Until the spell ends, any attack you make deals an extra 2d8 damage when you hit a creature within 15 feet of you. This damage is Bludgeoning, Cold, Fire, or Lightning (your choice when you make the attack)." + "\n   " + "In addition, the ground within 15 feet of you is Difficult Terrain for your enemies." + AtHigherLevels + "When you cast this spell using a spell slot of level 5 or higher, the damage increases by 2d8 and the range of Difficult Terrain increases by 5 feet for each slot level above 4.",
};
SpellsList["conjure woodland beings ua23pt8"] = {
	name : "Conjure Woodland Beings (UA23PT8)",
	source : [["UA23PT8", 19], ["P", 226], ["MJ:HB", 0]],
	classes : ["druid", "druid_ua23pt8", "ranger", "ranger_ua23pt6"],
	level : 5,
	school : "Conj",
	time : "1 a",
	range : "S:10" + (typePF ? "-" : "") + "ft rad",
	rangeMetric : "S:3m rad",
	components : "V,S",
	duration : "Conc, 10 m",
	save : "Wis",
	description : "Creatures I chose that enter save or take 5d8 Force, half on success; I can Disengage as Bonus Action",
	descriptionFull : "You summon nature spirits that flit about you for the duration. Until the spell ends, each creature you choose that enters a space within 10 feet of you for the first time on a turn or starts its turn there must make a Wisdom saving throw, taking 5d8 Force damage on a failed save or half as much damage on a successful one." + "\n   " + "In addition, you can take the Disengage action as a Bonus Action for the spell’s duration." + AtHigherLevels + "When you cast this spell using a spell slot of level 6 or higher, the damage increases by 1d8 for each slot level above 5.",
};
SpellsList["cure wounds ua23pt8"] = {
	name : "Cure Wounds (UA23PT8)",
	source : [["UA23PT8", 19], ["SRD", 132], ["P", 230], ["MJ:HB", 0]],
	classes : ["artificer", "bard", "cleric", "cleric_ua23pt6", "druid", "druid_ua23pt8", "paladin", "paladin_ua23pt6", "ranger", "ranger_ua23pt6"],
	level : 1,
	school : "Abjur",
	time : "1 a",
	range : "Touch",
	components : "V,S",
	duration : "Instantaneous",
	description : "1 living creature heals 2d8+2d8/SL+spellcasting ability modifier HP", //Ripped directly from "ListsSpells.js" and then altered
	descriptionFull : "A creature you touch regains a number of Hit Points equal to 2d8 plus your spellcasting ability modifier. This spell has no effect on Constructs and Undead." + AtHigherLevels + "When you cast this spell using a spell slot of level 2 or higher, the healing increases by 2d8 for each slot level above 1.",
};
SpellsList["fount of moonlight ua23pt8"] = {
	name : "Fount of Moonlight (UA23PT8)",
	source : [["UA23PT8", 20], ["MJ:HB", 0]],
	classes : ["bard", "druid", "druid_ua23pt8"],
	level : 4,
	school : "Evoc",
	time : "1 a",
	range : "S",
	components : "V,S",
	duration : "Conc, 10 m",
	save : "Con",
	description : "Melee atks +2d6 Rad dmg; Resistance to Rad; Rea to force crea save or be Blinded; emit light; See bk",
	descriptionFull : "A cool light wreathes your body for the duration, emitting Bright Light in a 20-foot radius and Dim Light for an additional 20 feet." + "\n   " + "Until the spell ends, you have Resistance to Radiant damage, and your melee attacks deal an extra 2d6 Radiant damage on a hit." + "\n   " + "In addition, immediately after you take damage from a creature you can see within 60 feet of yourself, you can use your Reaction to force the creature to make a Constitution saving throw. On a failed save, the creature has the Blinded condition until the end of your next turn.",
};
SpellsList["healing word ua23pt8"] = {
	name : "Healing Word (UA23PT8)",
	source : [["UA23PT8", 20], ["SRD", 153], ["P", 250], ["MJ:HB", 0]],
	classes : ["bard", "cleric", "cleric_ua23pt6", "druid", "druid_ua23pt8"],
	level : 1,
	school : "Abjur",
	time : "1 bns",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V",
	duration : "Instantaneous",
	description : "1 living creature heals 2d4+2d4/SL+spellcasting ability modifier HP", //Ripped directly from "ListsSpells.js" and then altered
	descriptionFull : "A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier. This spell has no effect on Constructs or Undead." + AtHigherLevels + "When you cast this spell using a spell slot of level 2 or higher, the healing increases by 2d4 for each slot level above 1.",
};
SpellsList["mass cure wounds ua23pt8"] = {
	name : "Mass Cure Wounds (UA23PT8)",
	source : [["UA23PT8", 20], ["SRD", 162], ["P", 258], ["MJ:HB", 0]],
	classes : ["bard", "cleric", "cleric_ua23pt6", "druid", "druid_ua23pt8"],
	level : 5,
	school : "Abjur",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V,S",
	duration : "Instantaneous",
	description : "Up to 6 living crea within 30-ft rad sphere heal 5d8+1d8/SL+spellcasting ability modifier HP", //Ripped directly from "ListsSpells.js" and then altered
	descriptionFull : "A wave of healing energy emanates from a point you can see within range. Choose up to six creatures in a 30-foot-radius Sphere centered on that point. Each target regains Hit Points equal to 5d8 plus your spellcasting ability modifier. This spell has no effect on Constructs or Undead." + AtHigherLevels + "When you cast this spell using a spell slot of level 6 or higher, the healing increases by 1d8 for each slot level above 5.",
};
SpellsList["mass healing word ua23pt8"] = {
	name : "Mass Healing Word (UA23PT8)",
	source : [["UA23PT8", 20], ["SRD", 163], ["P", 258], ["MJ:HB", 0]],
	classes : ["bard", "cleric", "cleric_ua23pt6"],
	level : 3,
	school : "Abjur",
	time : "1 bns",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V",
	duration : "Instantaneous",
	description : "6 living creatures heal 2d4+1d4/SL+spellcasting ability modifier HP", //Ripped directly from "ListsSpells.js" and then altered
	descriptionFull : "As you call out words of restoration, up to six creatures of your choice that you can see within range regain Hit Points equal to 2d4 plus your spellcasting ability modifier. This spell has no effect on Constructs or Undead." + AtHigherLevels + "When you cast this spell using a spell slot of level 4 or higher, the healing increases by 1d4 for each slot level above 3.",
};
SpellsList["power word fortify ua23pt8"] = {
	name : "Power Word Fortify (UA23PT8)",
	source : [["UA23PT8", 20], ["MJ:HB", 0]],
	classes : ["bard", "cleric", "cleric_ua23pt6"],
	level : 7,
	school : "Ench",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V",
	duration : "Instantaneous",
	description : "120 Temp HP divided equally among up to 6 creatures",
	descriptionFull : "You speak a word of power that fortifies up to six creatures you can see within range. The spell bestows 120 Temporary Hit Points, which are divided equally among the spell’s recipients.",
};
SpellsList["starry wisp ua23pt8"] = {
	name : "Starry Wisp (UA23PT8)",
	source : [["UA23PT8", 20], ["MJ:HB", 0]],
	classes : ["bard", "cleric", "cleric_ua23pt6"],
	level : 0,
	school : "Evoc",
	time : "1 a",
	range : "60 ft",
	rangeMetric : "18 m",
	components : "V,S",
	duration : "Instantaneous",
	description : "Spell atk at crea/object in range, Radiant dmg; target emits Dim Light \u0026 no Invisible benefits; see book.",
	descriptionCantripDie : "Spell atk at crea/object in range, `CD`d8 Radiant dmg; target emits Dim Light \u0026 no Invisible benefits; see book.",
	descriptionFull : "You launch a mote of light at one creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d8 Radiant damage, and until the end of your next turn, it emits Dim Light in a 10-foot radius and can’t benefit from the Invisible condition." + "\n   " + "Cantrip Upgrade. This spell’s damage increases by 1d8 when you reach levels 5 (2d8), 11 (3d8), and 17 (4d8).",
};