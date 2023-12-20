var map;
var marker;
var mainData;
var nameToShow = null;

const URLs = 'https://khkt-lc.onrender.com/home';

function get_data() {
    fetch(URLs)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            mainData = data;
        })
        .catch(error => {
            console.log("Lỗi truy vấn!", error);
        });
    // // console.log(name);
    if (nameToShow != null) {
        showInfor(nameToShow);
    }
}

function init() {

    var options = {
        zoom: 13,
        center: { lat: 22.4809431, lng: 103.9754959 }
    }

    map = new google.maps.Map(document.getElementById('map'), options);

    fetch(URLs)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                showInList(item.name, item.updatedAt);

                // var lat = parseFloat(item.kinh);
                // var lng = parseFloat(item.viDo);

                // var position = { lat, lng };
                // marker = new google.maps.Marker({
                //     position: position,
                //     map: map,
                //     icon: "source\\2.ico",
                //     title: item.name
                // });
            });
        })
        .catch(error => {
            console.log("Lỗi truy vấn!", error);
        });

    setInterval(get_data, 5000);
}
function hideToolsBar() {
    const toolsBar = document.getElementById('toolsBar');
    const image = document.getElementById('hideButtonIcon');

    if (toolsBar.classList.contains('hide-tools-bar')) {
        toolsBar.classList.remove('hide-tools-bar');
        image.classList.add('hide-button-icon');
        image.classList.remove('flip-button-icon');
    } else {
        toolsBar.classList.add('hide-tools-bar');
        image.classList.remove('hide-button-icon');
        image.classList.add('flip-button-icon');
    }
}
function showInList(name, updatedAt) {
    var container = document.querySelector('.container');
    let div = document.createElement('button');

    div.classList.add('new-point');
    div.setAttribute('id', 'newPoint');
    div.setAttribute('name', name);

    let html =
        '<img src="https://www.shareicon.net/data/512x512/2016/08/04/806892_interface_512x512.png" alt="ico" id="map-point-icon">' +
        '<b>' + name + '</b>';
    if (check(updatedAt)) {
        //onclick="deletePoint(this.parentNode,\'' + name + '\')
        html += '<button id="cancel-button-child-online"></button>';
        div.setAttribute('onclick', 'showInfor(\'' + name + '\')');
    } else {
        html += '<button id="cancel-button-child-offline"></button>';
    }
    console.log(check(updatedAt));
    div.innerHTML = html;
    container.insertAdjacentElement('beforebegin', div);
}
function showInfor(name) {
    // console.log(name);
    nameToShow = name;
    const targetData = mainData.find(item => item.name === name);

    if (targetData) {
        displayInfor(
            targetData.name,
            targetData.luongMua,
            targetData.doAm,
            targetData.daAm1,
            targetData.doNghieng,
            targetData.thoiGianMua,
            targetData.satLo
        );

        var lat = parseFloat(targetData.kinh);
        var lng = parseFloat(targetData.viDo);

        var position = { lat, lng };

        if (parseInt(targetData.satLo) == 4) {
            marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: "1.ico",
                title: targetData.name
            });
        } else {
            marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: "2.ico",
                title: targetData.name
            });
        }

        var latLng = new google.maps.LatLng(targetData.kinh, targetData.viDo);
        map.panTo(latLng);
    } else {
        if (document.querySelector('table')) {
            removeTable();
        }
        console.log("Không tìm thấy điểm nào có tên như vậy!");
    }
}
function displayInfor(name, luongmua, doam, doam1, donghieng, rain_time, satLo) {
    if (document.querySelector('table')) {
        removeTable();
    }

    let table = document.createElement('table');

    table.classList.add('table');

    let html = '<table>' +
        '<div id="table-title">Vị trí: ' + name + '</div>' +
        '<tbody>' +
        '<tr>' +
        '<th id="hName" class="name">Độ ẩm 1:</th>' +
        '<th id="hValue" class="value">' + doam + '%</th>' +
        '</tr>' +
        '<tr>' +
        '<th id="hName" class="name">Độ ẩm 2:</th>' +
        '<th id="hValue" class="value">' + doam1 + '%</th>' +
        '</tr>' +
        '<tr>' +
        '<th id="rName" class="name">Lượng mưa:</th>' +
        '<th id="rValue" class="value">' + luongmua + ' (l/s)</th>' +
        '</tr>' +
        '<tr>' +
        '<th id="lsName" class="name">Độ nghiêng:</th>' +
        '<th id="lsValue" class="value">' + donghieng + '°</th>' +
        '</tr>' +
        '<tr>' +
        '<th id="sName" class="name">Thời gian mưa:</th>' +
        '<th id="sValue" class="value">' + rain_time + ' (phút)</th>' +
        '</tr>' +
        '<tr>' +
        '<th id="sName" class="name">Nguy cơ sạt lở:</th>' +
        '<th id="sValue" class="value">' + satLo + '</th>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

    table.innerHTML = html;

    var container = document.querySelector('.show-point-infor');
    container.insertAdjacentElement('beforebegin', table);
}
function removeTable() {
    var remove = document.querySelector('table');

    if (remove && remove.parentNode) {
        remove.parentNode.removeChild(remove);
    } else {
        console.error('Element not found or has no parent node');
    }
}
function check(timeUpdate) {
    var dateObject = new Date(timeUpdate);
    var currentTime = new Date();

    let time_in_second = currentTime.getSeconds() - dateObject.getSeconds();

    if (time_in_second < 0 || time_in_second > 40) return false;
    else return true;
}



function pushPointToDatabase(ten, kinhdo, vido) {
    // const data = {
    //     name: ten,
    //     kinhDo: kinhdo,
    //     viDo: vido,
    //     doAm: '0',
    //     luongMua: '0',
    //     satLo: '0',
    //     status: '1',
    // };

    // fetch(URLs, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // }).then(response => {
    //     if (!response.ok) {
    //         console.log(`HTTP error! Status: ${response.status}`);
    //     } else {
    //         console.log("Tải dữ liệu lên DataBase thành công!");
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}
function deletePoint(elementToRemove, name) {
    // fetch(URLs)
    //     .then(response => {
    //         if (!response.ok) {
    //             console.log(`HTTP error! Status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         const targetData = data.find(item => item.name === name);
    //         console.log(targetData._id);

    //         if (targetData) {
    //             fetch(URLs + '/' + targetData._id, { method: 'DELETE' })
    //                 .then(() => {
    //                     displayInfor("", "", "", "", "");
    //                 })
    //         } else {
    //             console.log("Không tìm thấy điểm nào có tên như vậy!");
    //         }
    //     })
    //     .catch(error => {
    //         console.log("Lỗi truy vấn!", error);
    //     });
    // if (elementToRemove && elementToRemove.parentNode) {
    //     elementToRemove.parentNode.removeChild(elementToRemove);
    // } else {
    //     console.error('Element not found or has no parent node');
    // }
}
function addPointPopup() {
    const popupToHide = document.getElementById('popup');
    if (popupToHide.classList.contains('hide-popup')) {
        popupToHide.classList.replace('hide-popup', 'add-point-popup');
    }
}
function hiddenPopup() {
    const popupToHide = document.getElementById('popup');
    popupToHide.classList.replace('add-point-popup', 'hide-popup');
}
function addNewPoint() {
    var title = document.getElementById('titleOfPoint').value;
    var lat = parseFloat(document.getElementById('lat').value);
    var lng = parseFloat(document.getElementById('lng').value);

    if (title && !isNaN(lat) && !isNaN(lng)) {
        var position = { lat, lng };
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title
        });

        pushPointToDatabase(
            document.getElementById('titleOfPoint').value,
            document.getElementById('lat').value,
            document.getElementById('lng').value
        )

        map.panTo(marker.getPosition());
        hiddenPopup();
        showInList(title);
    } else {
        console.error('Lỗi thực thi trong quá trình đọc dữ liệu đầu vào.');
    }
    document.getElementById('titleOfPoint').value = ''
    document.getElementById('lat').value = ''
    document.getElementById('lng').value = ''
}
