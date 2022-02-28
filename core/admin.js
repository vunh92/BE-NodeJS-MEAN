class Admin
{
    constructor(url='')
    {
        this.url = url;
    }

    get_module()
    {
        // tách chuỗi thành mảng
        return this.url.split('/')[2];
    }

    input(type='text', name='', id='', _class='', required=true, placeholder='', disabled=false, changeSlug=false)
    {
        var _req = (required==true) ? 'required="required"' : '';
        var _dis = (disabled==true) ? 'disabled' : '';
        var _che = (changeSlug==true) ? 'onchange="ChangeToSlug()" onkeyup="ChangeToSlug()" onkeydown="ChangeToSlug()"' : '';

        var str = '<input type="'+type+'" name="'+name+'" id="'+id+'" '+_req+' class="form-control '+_class+'" placeholder="'+placeholder+'" '+_dis+ ' '+ _che +'>';
            str += '<span class="error error_'+name+'"></span>';

        return str;
    }

    select(name='', id='', _class='', array=[], required=true, disabled=false, dequy=false)
    {
        var _req = (required==true) ? 'required="required"' : '';
        var _dis = (disabled==true) ? 'disabled' : '';

        var option='';

        if(dequy==false){
            array.forEach(e=>{
                // xét selected
                var _sel = (e.selected == 'selected') ? 'selected' : '';
    
                option+='<option value="'+e.value+'" '+_sel+'>'+e.name+'</option>';
            })
        }else{
            option+=array;
        }

        var str = `<select name="`+name+`" id="`+id+`" class="form-control `+_class+`" `+_req+` `+_dis+`>
            <option value="">--Chọn--</option>`
            + option +
        `</select>`;
        
        str += '<span class="error error_'+name+'"></span>';

        return str;
    }

    textarea(name='', id='', _class='', ckeditor=false, rows='5', cols='5', required=true, disabled=false)
    {
        var _req = (required==true) ? 'required="required"' : '';
        var _dis = (disabled==true) ? 'disabled' : '';
        var _cke = (ckeditor==true) ? '<script>CKEDITOR.replace("'+id+'");</script>' : '';

        return '<textarea name="'+name+'" rows="'+rows+'" cols="'+cols+'" id="'+id+'" class="form-control '+_class+'" '+_req+' '+_dis+'></textarea>' + _cke;
    }

    label(name='', _for='', required=false, element='', _class='col-form-label col-md-3 col-sm-3 label-align')
    {
        var _req = (required==true) ? ' <span class="required text-danger">(*)</span>' : '';

        var _text = (element=='select') ? 'Chọn ' : 'Nhập ';

        return `<label class="`+_class+`" for="`+_for+`">
            `+ _text + this.change_name(name) + _req + ` 
        </label>`;
    }

    change_name(key='')
    {
        var name='';

        switch (key) {
            case 'name': name='Tên'; break;
            case 'slug': name='Slug'; break;
            case 'content': name='Nội Dung'; break;
            case 'parent': name='Cha'; break;
            case 'username': name='Tên Đăng Nhập'; break;
            case 'password': name='Mật Khẩu'; break;
            case 'email': name='E-Mail'; break;
            case 'phone': name='Số Điện Thoại'; break;
            case 'role': name='Vai Trò'; break;
        
            default: name='No_Name'; break;
        }

        return name;
    }

    dequy(array=[], id='')
    {
        var json=[];

        array.forEach(e => {
            if(e.parent == id){
                json.push({
                  name: e.name,
                  slug: e.slug,
                  childs: this.dequy(array, e._id)
                })
            }
        });

        return json;
    }

    ChangeToSlug(title='')
    {
        var slug='';
    
        //Đổi chữ hoa thành chữ thường
        slug = title.toLowerCase();
    
        //Đổi ký tự có dấu thành không dấu
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        //Xóa các ký tự đặt biệt
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        //Đổi khoảng trắng thành ký tự gạch ngang
        slug = slug.replace(/ /gi, "-");
        //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
        //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        //Xóa các ký tự gạch ngang ở đầu và cuối
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        //In slug ra textbox có id “slug”
        return slug;
    }
}

module.exports = Admin;