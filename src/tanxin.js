
function prepareChannel(){
    channels = new Array();
    // 渠道1： 德州， 有购置税， 无中转费， 算汇率
    channels.push({
	name : "DE",
	tax : $('.tax').val(),
	transferfee : 0,
	exchangerate : $('.exchangerate').val()
    });
    // 渠道1： 某免税州， 无购置税， 有中转费（人民币）， 算汇率
    channels.push({
	name : "NO-TAX",
	tax : 0,
	transferfee : $('.transferfee').val(),
	exchangerate : $('.exchangerate').val()
    });
    return channels;
}

function printHeader(channels){
    msg = [];
    msg.push('ITEM # : NAME, price --> ');
    for(var i = 0;i<channels.length;i++){
	msg.push(channels[i].name);
	if(i<channels.length){ 
	    msg.push(', ');
	}
    }
    return msg.join('');
}

function printHeaderHTML(channels){
    msg = [];
    msg.push('<tr>');
    msg.push('<th>ITEM #</th>');
    msg.push('<th>NAME</th>');
    msg.push('<th>UNIT</th>');
    msg.push('<th>QUANTITY</th>');
    for(var i = 0;i<channels.length;i++){
	msg.push('<th>');
	msg.push(channels[i].name);
	msg.push('</th>');
    }
    msg.push('</tr>');
    return msg.join('');
}

function prepareTestData(){
    item = {
	name : "HHKB",
	unit : 76.2,
	quantity : 1,
	weight : 2,
    };
    
    items = [];
    items.push(item);
    items.push({
	name : "xile or kele",
	unit : 100,
	quantity : 2,
	weight : 17.2,
    });


    // start calculate...
    console.log('========================== start debug output');
    console.log(item);

    return items;
}

function prepareData(){
    var itemnames = $('.itemname');
    var itemunits = $('.itemunit');
    var itemquantities = $('.itemquantity');
    var itemweights = $('.itemweight');
    var items = new Array();

    for( var i = 0; i< itemnames.length; i++){
	var item = {
	    name : itemnames[i].value,
	    unit : parseInt(itemunits[i].value),
	    quantity : parseFloat(itemquantities[i].value),
	    weight : parseInt(itemweights[i].value)
	}
	items.push(item);
	console.log(item); // debug output
    }
    return items;
}

function calculate(item, channel){
    var charge = 0;
    charge = item.unit * item.quantity
	* (1 + channel.tax * 0.01)
	* channel.exchangerate
	+ item.weight * item.quantity * channel.transferfee;
    return charge;
}

function calculateAll(item, channels){
    values = [];
    for(var i = 0;i<channels.length;i++){
	values.push(calculate(item, channels[i]));
    }
    return values;
}


function finalOutput(){
    channels = prepareChannel();

    console.log('==========================');
    headermsg  = printHeader(channels);
    console.log(headermsg);

    items = prepareData();

    for ( var i = 0; i < items.length; i++){
	var msg = new Array();
	var t = items[i];
	msg.push('item ' + i + ' : ');
	msg.push('[' + t.name + "], $" + t.unit + ' * ' + t.quantity);
	msg.push(' --> ');
	values = calculateAll(t, channels);

	for(var j = 0;j<values.length;j++){
	    msg.push(values[j]);
	    if(j < values.length){ 
		msg.push(', ');
	    }
	}
	console.log(msg.join(''));
    }
}

function finalOutput2page(){
    channels = prepareChannel();

    var finalmsg = [];
    headermsg  = printHeader(channels);
    finalmsg.push(headermsg);
    finalmsg.push('==========================');

    items = prepareData();

    for ( var i = 0; i < items.length; i++){
	var msg = new Array();
	var t = items[i];
	msg.push('item ' + i + ' : ');
	msg.push('[' + t.name + "], $" + t.unit + ' * ' + t.quantity);
	msg.push(' --> ');
	values = calculateAll(t, channels);

	for(var j = 0;j<values.length;j++){
	    msg.push(values[j]);
	    if(j < values.length){ 
		msg.push(', ');
	    }
	}
	finalmsg.push(msg.join(''));
    }
    $('.resultZone').html(finalmsg.join('<br />'));
}

function finalOutput2pageHTML(){
    channels = prepareChannel();

    var finalmsg = [];
    finalmsg.push('<table class="resultTable">');
    finalmsg.push(printHeaderHTML(channels));

    items = prepareData();

    for ( var i = 0; i < items.length; i++){
	var msg = new Array();
	msg.push('<tr>');
	var t = items[i];
	msg.push('<td>item ' + i + ' </td>');
	msg.push('<td>' + t.name + "</td><td>$" + t.unit + '</td>');
	msg.push('<td>'+ t.quantity+ '</td>');

	values = calculateAll(t, channels);

	// choose min value
	var minvalue = 0;
	for(var j = 0;j<values.length;j++){
	    if(j==0){
		minvalue = values[0];
	    }
	    if(minvalue > values[j]){
		minvalue = values[j];
	    }
	}
	for(var j = 0;j<values.length;j++){
	    if(values[j] == minvalue){
		msg.push('<td class="lowvalue">' + values[j].toFixed(2) + '</td>');
	    }else{
		msg.push('<td>' + values[j].toFixed(2) + '</td>');
	    }
	}
	msg.push('</tr>');
	finalmsg.push(msg.join(''));

    }
    $('.resultZone').html(finalmsg.join(''));
    finalmsg.push('</table>');

    // process HTML5 storage.
    store();
}

/*
 * addable table
 */
function tableAddItem(){
    var table = $('#vtable');
    
    var lastline = undefined;
    var lines = $('#vtable tbody tr');
    if(lines.length > 0){
	lastline = lines[lines.length-1];
    }
    $('#vtable').append($(lastline).clone())
}


/*
 * HTML5 save to storage
 */

function supports_html5_storage() {  
  try {  
    return 'localStorage' in window && window['localStorage'] !== null;  
  } catch (e) {  
    return false;  
  }  
} 

function store(){
    var st = window.localStorage;

    // store global values
    st.setItem('global.tax', $('.tax').val());
    st.setItem('global.transferfee', $('.transferfee').val());
    st.setItem('global.exchangerate', $('.exchangerate').val());

    // store items;
    var itemnames = $('.itemname');
    var itemunits = $('.itemunit');
    var itemquantities = $('.itemquantity');
    var itemweights = $('.itemweight');
    
    st.setItem('items.length', itemnames.length);

    for( var i = 0; i< itemnames.length; i++){
	st.setItem('items' + i + '.name', itemnames[i].value)
	st.setItem('items' + i + '.unit', itemunits[i].value)
	st.setItem('items' + i + '.quantity', itemquantities[i].value)
	st.setItem('items' + i + '.weights', itemweights[i].value)
    }
}

function load(){
    var st = window.localStorage;

    // load global values from storage
    var tax = st.getItem('global.tax');
    if(tax){
	 $('.tax').val(tax);
    }
    var tf = st.getItem('global.transferfee');
    if(tf){
	$('.transferfee').val(tf);
    }
    
    var rate = st.getItem('global.exchangerate');
    if(rate){
	$('.exchangerate').val(rate)
    }


    // load items;
    var strLength = st.getItem('items.length');
    if(strLength){
	var length = parseInt(strLength);
	var trs = $('#vtable tr');
	for(var i = 1; i<length; i++){
	    tableAddItem();
	}
	for(var i = 0; i<length; i++){
	    var name = st.getItem('items' + i + '.name');
	    var inputs = $('#vtable tbody>:nth-child('+ (i+2) +') input');
	    $(inputs[0]).val(name);
	    $(inputs[1]).val(st.getItem('items' + i + '.unit'));
	    $(inputs[2]).val(st.getItem('items' + i + '.quantity'));
	    $(inputs[3]).val(st.getItem('items' + i + '.weights'));
	}
    }
    var itemnames = $('.itemname');
    var itemunits = $('.itemunit');
    var itemquantities = $('.itemquantity');
    var itemweights = $('.itemweight');
    
    st.setItem('items.length', itemnames.length);

    for( var i = 0; i< itemnames.length; i++){
	st.setItem('items' + i + '.name', itemnames[i].value)
	st.setItem('items' + i + '.unit', itemunits[i].value)
	st.setItem('items' + i + '.quantity', itemquantities[i].value)
	st.setItem('items' + i + '.weights', itemweights[i].value)
    }

}

$(document).ready(function(){
    console.log('starting debug....');
    if(! supports_html5_storage()){
	alert('Your browser doesn\'t support HTML5 Storage, everything after refresh will lose!');
    }

    // load saved values;
    load();
});

