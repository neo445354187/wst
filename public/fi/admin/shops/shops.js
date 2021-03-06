var grid;
function initGrid(){
	grid = $("#maingrid").ligerGrid({
		url:FI.U('admin/shops/pageQuery'),
		pageSize:FI.pageSize,
		pageSizeOptions:FI.pageSizeOptions,
		height:'99%',
        width:'100%',
        minColToggle:6,
        rownumbers:true,
        columns: [
            { display: '店铺编号', name: 'shopSn',isSort: false},
	        { display: '店铺名称', name: 'shopName',isSort: false},
	        { display: '店主姓名', name: 'shopkeeper',isSort: false},
	        { display: '店主联系电话', name: 'telephone',isSort: false},
	        { display: '店主店铺地址', name: 'shopAddress',isSort: false},
	        { display: '所属公司', name: 'shopCompany',isSort: false},
	        { display: '营业状态', name: 'shopAtive',isSort: false,render: function (rowdata, rowindex, value){
	        	return (rowdata['shopAtive']==1)?"营业中":"休息中";
	        }},
	        { display: '操作', name: 'op',isSort: false,render: function (rowdata, rowindex, value){
	            var h = "";
	            if(FI.GRANT.DPGL_02)h += "<a href='javascript:toEdit(" + rowdata['shopId'] + ")'>修改</a> ";
	            if(FI.GRANT.DPGL_03)h += "<a href='javascript:toDel(" + rowdata['shopId'] + ")'>删除</a> "; 
	            return h;
	        }}
        ]
    });
}
function initStopGrid(){
	grid = $("#maingrid").ligerGrid({
		url:FI.U('admin/shops/pageStopQuery'),
		pageSize:FI.pageSize,
		pageSizeOptions:FI.pageSizeOptions,
		height:'99%',
        width:'100%',
        minColToggle:6,
        rownumbers:true,
        columns: [
            { display: '店铺编号', name: 'shopSn',isSort: false},
	        { display: '店铺名称', name: 'shopName',isSort: false},
	        { display: '店主姓名', name: 'shopkeeper',isSort: false},
	        { display: '店主联系电话', name: 'telephone',isSort: false},
	        { display: '店主店铺地址', name: 'shopAddress',isSort: false},
	        { display: '所属公司', name: 'shopCompany',isSort: false},
	        { display: '营业状态', name: 'shopAtive',isSort: false,render: function (rowdata, rowindex, value){
	        	return (rowdata['shopAtive']==1)?"营业中":"休息中";
	        }},
	        { display: '操作', name: 'op',isSort: false,render: function (rowdata, rowindex, value){
	            var h = "";
	            h += "<a href='javascript:toEdit(" + rowdata['shopId'] + ")'>修改</a> ";
	            h += "<a href='javascript:toDel(" + rowdata['shopId'] + ")'>删除</a> "; 
	            return h;
	        }}
        ]
    });
}
function initEdit(opts){
	FI.upload({
	  	  pick:'#shopImgPicker',
	  	  formData: {dir:'shops'},
	  	  accept: {extensions: 'gif,jpg,jpeg,bmp,png',mimeTypes: 'image/*'},
	  	  callback:function(f){
	  		  var json = FI.toAdminJson(f);
	  		  if(json.status==1){
	  			$('#uploadMsg').empty().hide();
	            $('#preview').attr('src',FI.conf.ROOT+"/"+json.savePath+json.thumb);
	            $('#shopImg').val(json.savePath+json.name);
	            $('#editFrom').validator('hideMsg', '#shopImg');
	  		  }
		  },
		  progress:function(rate){
		      $('#uploadMsg').show().html('已上传'+rate+"%");
		  }
	});
	initTime('#serviceStartTime',opts.serviceStartTime);
	initTime('#serviceEndTime',opts.serviceEndTime);
	if($('#shopId').val()>0){
		var areaIdPath = opts.areaIdPath.split("_");
    	$('#area_0').val(areaIdPath[0]);
    	var aopts = {id:'area_0',val:areaIdPath[0],childIds:areaIdPath,className:'j-areas',isRequire:true}
		FI.ITSetAreas(aopts);
	}
	
}
function toEdit(id){
	location.href=FI.U('admin/shops/toEdit','id='+id);
}
function toDel(id){
	var box = FI.confirm({content:"您确定要删除该店铺吗?",yes:function(){
	           var loading = FI.msg('正在提交数据，请稍后...', {icon: 16,time:60000});
	           $.post(FI.U('admin/shops/del'),{id:id},function(data,textStatus){
	           			  layer.close(loading);
	           			  var json = FI.toAdminJson(data);
	           			  if(json.status=='1'){
	           			    	FI.msg("操作成功",{icon:1});
	           			    	layer.close(box);
	           		            grid.reload();
	           			  }else{
	           			    	FI.msg(json.msg,{icon:2});
	           			  }
	           		});
	            }});
}
function checkLoginKey(obj){
	if($.trim(obj.value)=='')return;
	var params = {key:obj.value,userId:0};
	var loading = FI.msg('正在提交数据，请稍后...', {icon: 16,time:60000});
    $.post(FI.U('admin/users/checkLoginKey'),params,function(data,textStatus){
    	layer.close(loading);
    	var json = FI.toAdminJson(data);
    	if(json.status!='1'){
    		FI.msg(json.msg,{icon:2});
    		obj.value = '';
    	}
    });
}
function save(){
	$('#editFrom').isValid(function(v){
		if(v){
			var params = FI.getParams('.ipt');
			params.areaId = FI.ITGetAreaVal('j-areas');
			var loading = FI.msg('正在提交数据，请稍后...', {icon: 16,time:60000});
		    $.post(FI.U('admin/shops/'+((params.shopId==0)?"add":"edit")),params,function(data,textStatus){
		    	layer.close(loading);
		    	var json = FI.toAdminJson(data);
		    	if(json.status=='1'){
		    		FI.msg("操作成功",{icon:1});
		    		location.href=FI.U('admin/shops/index');
		    	}else{
		    		FI.msg(json.msg,{icon:2});
		    	}
		    });
		}
	});
}
function initTime($id,val){
	var html = [],t0,t1;
	var str = val.split(':');
	for(var i=0;i<24;i++){
		t0 = (val.indexOf(':00')>-1 && (parseInt(str[0],10)==i))?'selected':'';
		t1 = (val.indexOf(':30')>-1 && (parseInt(str[0],10)==i))?'selected':'';
		html.push('<option value="'+i+':00" '+t0+'>'+i+':00</option>');
		html.push('<option value="'+i+':30" '+t1+'>'+i+':30</option>');
	}
	$($id).append(html.join(''));
}
