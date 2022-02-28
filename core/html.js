// Gọi class Admin
const Admin = require('./admin');

class Html extends Admin
{
    html_form(array=[], module='')
    {
        var str=`<div class="row">
        <div class="col-md-12 col-sm-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Thêm dữ liệu</h2>
                    <ul class="nav navbar-right panel_toolbox">
                        <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a class="dropdown-item" href="#">Settings 1</a>
                                </li>
                                <li><a class="dropdown-item" href="#">Settings 2</a>
                                </li>
                            </ul>
                        </li>
                        <li><a class="close-link"><i class="fa fa-close"></i></a>
                        </li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />`;

        array.forEach(e=>{

            // xét thuộc element nào
            if(e.element == 'input')
            {
                str += '<div class="item form-group">';
                str += this.label(e.name, e.id, e.required, e.element);
                str += '<div class="col-md-6 col-sm-6">';
                str += this.input(e.type, e.name, e.id, e.class, e.required, e.placeholder, e.disabled, e.changeSlug);
                str += '</div></div>';
            }
            else if(e.element == 'select')
            {
                str += '<div class="item form-group">';
                str += this.label(e.name, e.id, e.required, e.element);
                str += '<div class="col-md-6 col-sm-6">';
                str += this.select(e.name, e.id, e.class, e.array, e.required, e.disabled, e.dequy);
                str += '</div></div>';
            }
            else if(e.element == 'textarea')
            {
                str += '<div class="item form-group">';
                str += this.label(e.name, e.id, e.required, e.element);
                str += '<div class="col-md-6 col-sm-6">';
                str += this.textarea(e.name, e.id, e.class, e.ckeditor, e.rows, e.cols, e.required, e.disabled);
                str += '</div></div>';
            }
        })

        str += '<div class="ln_solid"></div>';
        str += `<div class="item form-group">
            <div class="col-md-6 col-sm-6 offset-md-3">
                <button type="submit" class="btn btn-success">
                    <i class="fa fa-save"></i> Lưu lại
                </button>
                <a href="admin/`+module+`/index" class="btn btn-primary pull-right">Thoát</a>
            </div>
        </div>`;

        str += '</div></div></div></div>';

        return '<form id="formProcessData" method="POST" data-parsley-validate class="form-horizontal form-label-left">'+str+'</form>';
    }

    html_main(array=[], module='', count_trash=0, str_s='', count_sumPage)
    {
        var str=''; var i=0;
        array.forEach(e=>{ i++;
            str+=`<tr class="odd pointer" id="delete_`+e._id+`">
                <td class="a-center ">
                    <input type="checkbox" class="flat" name="table_records">
                </td>
                <td class=" ">`+i+`</td>
                <td class=" ">`+e.name+`</td>
                <td class=" ">
                    <input type="checkbox">
                </td>
                <td class=" last">
                    <a href="" class="btn btn-sm btn-round btn-info">
                        <i class="fa fa-edit"></i> Edit</a>
                    <button type="button" class="btn btn-sm btn-round btn-danger" data-toggle="modal" data-target=".bs-example-modal-sm" onclick="js_delete('`+e._id+`','`+e.name+`')">
                        <i class="fa fa-trash"></i> Delete</button>
                </td>
            </tr>`;
        })

        return `<div class="page-title">
            <div class="title_left">
                <h3>Danh Mục</h3>
            </div>

            <div class="title_right">
                <div class="col-md-5 col-sm-5 form-group pull-right top_search">
                    <form action="" method="GET">
                        <div class="input-group">
                            <input type="text" name="search" value="`+str_s+`" class="form-control" placeholder="Nhập từ khóa...">
                            <span class="input-group-btn">
                                <button class="btn btn-default" type="submit">Go!</button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="clearfix"></div>

        <div class="row" style="display: block;">
            <div class="col-md-12 col-sm-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>
                            <a href="/admin/`+ module +`/add" class="btn btn-sm btn-info">
                                <i class="fa fa-plus"></i> Add
                            </a>
                            <button type="button" class="btn btn-sm btn-danger">
                                <i class="fa fa-trash"></i>
                                (<span id="trash">`+count_trash+`</span>)
                            </button>
                        </h2>
                        <ul class="nav navbar-right panel_toolbox">
                            <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                    aria-expanded="false"><i class="fa fa-wrench"></i></a>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#">Settings 1</a>
                                    <a class="dropdown-item" href="#">Settings 2</a>
                                </div>
                            </li>
                            <li><a class="close-link"><i class="fa fa-close"></i></a>
                            </li>
                        </ul>
                        <div class="clearfix"></div>
                    </div>

                    <div class="x_content">

                        <p>Add class <code>bulk_action</code> to table for bulk actions options on row select</p>

                        <div class="table-responsive">
                            <table class="table table-striped jambo_table bulk_action">
                                <thead>
                                    <tr class="headings">
                                        <th style="width:10%">
                                            <input type="checkbox" id="check-all" class="flat">
                                        </th>
                                        <th class="column-title" style="width:10%">STT </th>
                                        <th class="column-title">Tên</th>
                                        <th class="column-title" style="width:10%">Status </th>
                                        <th class="column-title" style="width:20%"><span class="nobr">Chức Năng</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>`
                                + str +
                                `</tbody>
                            </table>
                        </div>`
                        +this.html_pagination(count_sumPage, module)+
                    `</div>
                </div>
            </div>
        </div>`;
    }

    html_dashboard()
    {
        return `<div class="row" style="display: inline-block;">
            <div class="tile_count">
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-user"></i> Total Users</span>
                    <div class="count">2500</div>
                    <span class="count_bottom"><i class="green">4% </i> From last Week</span>
                </div>
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-clock-o"></i> Average Time</span>
                    <div class="count">123.50</div>
                    <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>3% </i> From last Week</span>
                </div>
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-user"></i> Total Males</span>
                    <div class="count green">2,500</div>
                    <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                </div>
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-user"></i> Total Females</span>
                    <div class="count">4,567</div>
                    <span class="count_bottom"><i class="red"><i class="fa fa-sort-desc"></i>12% </i> From last Week</span>
                </div>
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-user"></i> Total Collections</span>
                    <div class="count">2,315</div>
                    <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                </div>
                <div class="col-md-2 col-sm-4  tile_stats_count">
                    <span class="count_top"><i class="fa fa-user"></i> Total Connections</span>
                    <div class="count">7,325</div>
                    <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 col-sm-12 ">
                <div class="dashboard_graph">

                    <div class="row x_title">
                        <div class="col-md-6">
                            <h3>Network Activities <small>Graph title sub-title</small></h3>
                        </div>
                        <div class="col-md-6">
                            <div id="reportrange" class="pull-right"
                                style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc">
                                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                                <span>December 30, 2014 - January 28, 2015</span> <b class="caret"></b>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-9 col-sm-9 ">
                        <div id="chart_plot_01" class="demo-placeholder"></div>
                    </div>
                    <div class="col-md-3 col-sm-3  bg-white">
                        <div class="x_title">
                            <h2>Top Campaign Performance</h2>
                            <div class="clearfix"></div>
                        </div>

                        <div class="col-md-12 col-sm-12 ">
                            <div>
                                <p>Facebook Campaign</p>
                                <div class="">
                                    <div class="progress progress_sm" style="width: 76%;">
                                        <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="80">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Twitter Campaign</p>
                                <div class="">
                                    <div class="progress progress_sm" style="width: 76%;">
                                        <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="60">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 col-sm-12 ">
                            <div>
                                <p>Conventional Media</p>
                                <div class="">
                                    <div class="progress progress_sm" style="width: 76%;">
                                        <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="40">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Bill boards</p>
                                <div class="">
                                    <div class="progress progress_sm" style="width: 76%;">
                                        <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="50">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="clearfix"></div>
                </div>
            </div>

        </div>`;
    }

    html_common(type='table', array=[], module='', count_trash, str_s, count_sumPage)
    {
        var str = '<div class="right_col" role="main"><div class="">';

        // Phần riêng
        if(type == 'table')
        {
            str += this.html_main(array, module, count_trash, str_s, count_sumPage);
        }
        else if(type == 'form')
        {
            str += this.html_form(array, module);
        }
        else if(type == 'dashboard')
        {
            str += this.html_dashboard();
        }

        str += '</div></div>';

        return str;
    }

    html_pagination(sumPage=0, module='')
    {
        var str=`<div class="row">
            <div class="col-sm-5">
                <div class="dataTables_info" id="datatable-responsive_info" role="status" aria-live="polite">Showing 1 to 10 of 57 entries</div>
            </div>
            <div class="col-sm-7">
                <div class="dataTables_paginate paging_simple_numbers" id="datatable-responsive_paginate">
                    <ul class="pagination">
                    <li class="paginate_button previous disabled" id="datatable-responsive_previous"><a href="#" aria-controls="datatable-responsive" data-dt-idx="0" tabindex="0">First</a></li>
                        <li class="paginate_button previous disabled" id="datatable-responsive_previous"><a href="#" aria-controls="datatable-responsive" data-dt-idx="0" tabindex="0">Previous</a></li>`
                        
                        for (let index = 0; index < sumPage; index++)
                        {
                            str+='<li class="paginate_button">';
                            str+='<a href="admin/'+module+'/index/'+(index+1)+'" aria-controls="datatable-responsive" data-dt-idx="2" tabindex="0">'+(index+1)+'</a>';
                            str+='</li>';
                        }
                        
                        str+=`<li class="paginate_button next" id="datatable-responsive_next"><a href="#" aria-controls="datatable-responsive" data-dt-idx="7" tabindex="0">Next</a></li>
                        <li class="paginate_button next" id="datatable-responsive_next"><a href="#" aria-controls="datatable-responsive" data-dt-idx="7" tabindex="0">Last</a></li>
                    </ul>
                </div>
            </div>
        </div>`;

        return str;
    }

    html_dequy(array=[], id='', char='')
    {
        var str='';

        array.forEach(e=>{
            var char_uplevel = char;

            if(e.parent == id){
                // cha
                str+='<option value="'+e.name+'">'+char + e.name+'</option>';
                // con
                str+=this.html_dequy(array, e.name, char_uplevel+='|-----');
            }
        })

        return str;
    }
}

module.exports = Html;