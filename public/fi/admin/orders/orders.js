var grid;
function initGrid(){
	grid = $("#maingrid").ligerGrid({
		url:FI.U('admin/orders/pageQuery'),
		pageSize:FI.pageSize,
		pageSizeOptions:FI.pageSizeOptions,
		height:'99%',
        width:'100%',
        minColToggle:6,
        rownumbers:true,
        columns: [
            { display: '订单编号', name: 'orderNo',isSort: false},
	        { display: '收货人', name: 'userName',isSort: false},
	        { display: '店铺', name: 'shopName',isSort: false},
	        { display: '订单总金额', name: 'totalMoney',isSort: false},
	        { display: '实收金额', name: 'realTotalMoney',isSort: false},
	        { display: '支付方式', name: 'payType',isSort: false},
	        { display: '配送方式', name: 'deliverType',isSort: false},
	        { display: '下单时间', name: 'createTime',isSort: false},
	        { display: '订单状态', name: 'status'},
	        { display: '操作', name: 'op',isSort: false,render: function (rowdata, rowindex, value){
	            var h = "";
	            h += "<a href='javascript:toView(" + rowdata['orderId'] + ")'>详情</a> ";
	            return h;
	        }}
        ]
    });
}

function toView(id){
	location.href=FI.U('admin/orders/view','id='+id);
}
function loadGrid(){
	var p = FI.arrayParams('.j-ipt');
	grid.set('url',FI.U('admin/orders/pageQuery',p.join('&')));
}
function initRefundGrid(){
	grid = $("#maingrid").ligerGrid({
		url:FI.U('admin/orders/refundPageQuery'),
		pageSize:FI.pageSize,
		pageSizeOptions:FI.pageSizeOptions,
		height:'99%',
        width:'100%',
        minColToggle:6,
        rownumbers:true,
        columns: [
            { display: '订单编号', name: 'orderNo',isSort: false},
	        { display: '收货人', name: 'userName',isSort: false},
	        { display: '店铺', name: 'shopName',isSort: false},
	        { display: '配送方式', name: 'deliverType',isSort: false},
	        { display: '订单总金额', name: 'totalMoney',isSort: false},
	        { display: '实收金额', name: 'realTotalMoney',isSort: false},
	        { display: '下单时间', name: 'createTime',isSort: false},
	        { display: '退款状态', name: 'isRefund',render: function (rowdata, rowindex, value){
	        	return (rowdata['isRefund']==1)?"已退款":"未退款";
	        }},
	        { display: '退款备注', name: 'refundRemark'},
	        { display: '操作', name: 'op',isSort: false,render: function (rowdata, rowindex, value){
	        	var h = '';
	            if(rowdata['isRefund']==0){
	            	if(FI.GRANT.TKDD_04)h += "<a href='javascript:toRefund(" + rowdata['orderId'] + ")'>退款</a> ";
	            }
	            h += "<a href='javascript:toView(" + rowdata['orderId'] + ")'>详情</a> ";
	            return h;
	        }}
        ]
    });
}
function loadRefundGrid(){
	var p = FI.arrayParams('.j-ipt');
	grid.set('url',FI.U('admin/orders/refundPageQuery',p.join('&')));
}

function toRefund(id){
	FI.open({type: 2,title:"订单退款",shade: [0.6, '#000'],border: [0],content: [FI.U('admin/orders/toRefund',{id:id}),'no'],area: ['550px', '350px'],offset:'auto'});
}
function orderRefund(id){
	$('#editFrom').isValid(function(v){
		if(v){
        	var params = {};
        	params.content = $.trim($('#content').val());
        	params.id = id;
        	ll = FI.msg('正在加载信息，请稍候...');
		    $.post(FI.U('admin/orders/orderRefund'),params,function(data){
		    	layer.close(ll);
		    	var json = FI.toAdminJson(data);
				if(json.status==1){
					FI.msg(json.msg, {icon: 1});
					parent.loadRefundGrid();
					closeIframe();
				}else{
					FI.msg(json.msg, {icon: 2});
				}
		   });
		}
    })
}
function closeIframe(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}