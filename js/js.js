var submitButton = document.getElementById("submit");
var nameInput = document.getElementById("name");
var url = document.getElementById("url");

function validateForm() {
    var reg = /^[A-Za-z0-9\-]{3,63}\.com(\/.*)?$/;
    if (nameInput.value === "" || url.value === "") {
        Swal.fire({
            title: "Error!",
            text: "Please fill out all fields.",
            icon: "error"
        });
        return false;
    }
    else if (nameInput.value.length < 3 || nameInput.value.length > 20) {
        Swal.fire({
            title: "Error!",
            text: "Name must be between 3 and 20 characters.",
            icon: "error"
        });
        return false;
    }
    else if (!reg.test(url.value.trim())) {
        Swal.fire({
            title: "Error!",
            text: "Please enter a valid URL that ends with .com.",
            icon: "error"
        });
        return false;
    }
    return true;
}

function addBookmark() {
    if (validateForm()) {
        var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        var bookmark = {
            name: nameInput.value,
            url: url.value
        };
        if (typeof(Storage) !== "undefined") {
            bookmarks.push(bookmark);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            Swal.fire({
                title: "Good job!",
                text: "Bookmark added successfully!",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error!",
                text: "Sorry, your browser does not support web storage...",
                icon: "error"
            });
            return;
        }
        nameInput.value = "";
        url.value = "";
        renderBookmarks();
    }
}

function renderBookmarks() {
    var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    var bookmarksTable = document.getElementById("bookmarks");
    var row = "";
    bookmarks.forEach((bookmark, index) => {
        row += `
        <tr class="bookmark equal-width">
            <td>${index + 1}</td>
            <td>${bookmark.name}</td>
            <td><button class="bt2  btn-danger" onclick="visit('${bookmark.url}')"><i class="bi bi-eye"></i> Visit</button></td>
            <td><button class="bt3  btn-primary" onclick="deleteBookmark('${bookmark.name}')"><i class="bi bi-trash"></i> Delete</button></td>
        </tr>
        `;
    });
    bookmarksTable.innerHTML = row;
}

function visit(url) {
    window.open("https://www." + url, "_blank");
}

function deleteBookmark(index) {



    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => 
    {
        if (result.isConfirmed) {
            var bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];          //delete bookmark
            bookmarks.splice(index, 1);
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            renderBookmarks();
            swalWithBootstrapButtons.fire(
            {
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            }
        );
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
            });
        }
    });

}

window.onload = function() {
    renderBookmarks();
};