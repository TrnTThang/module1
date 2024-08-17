class MenuItem {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

class OrderManager {
    constructor() {
        this.selectedTableOrType = '';
        this.menuList = [
            new MenuItem('Phở', 35),
            new MenuItem('Cơm Tấm', 30),
            new MenuItem('Gà Rán', 35),
            new MenuItem('Bún', 35),
            new MenuItem('Bánh Mì', 35)
        ];
        document.addEventListener('DOMContentLoaded', this.init.bind(this));
    }

    init() {
        this.populateFoodOptions();
        this.updateMenuList();
    }

    selectOption(option) {
        this.selectedTableOrType = option;
        alert('Bạn đã chọn: ' + option);
    }

    updateFoodSelection() {
        const foodSelect = document.getElementById('food');
        const quantityInput = document.getElementById('quantity');
        const selectedFood = foodSelect.value;
        const quantity = parseInt(quantityInput.value, 10);

        if (selectedFood && quantity > 0) {
            this.selectFood(selectedFood, quantity);
        }
    }

    selectFood(food, quantity) {
        if (!this.selectedTableOrType) {
            alert('Vui lòng chọn bàn hoặc loại đơn trước.');
            return;
        }

        if (!food) return;

        const unpaidOrdersTable = document.getElementById('unpaid-orders').getElementsByTagName('tbody')[0];
        const existingRow = Array.from(unpaidOrdersTable.rows).find(function(row) {
            return row.cells[0].innerHTML === this.selectedTableOrType && row.cells[1].innerHTML.includes(food);
        }.bind(this));

        if (existingRow) {
            // Update quantity in existing row
            const quantityCell = existingRow.cells[2];
            const currentQuantity = parseInt(quantityCell.innerHTML, 10);
            quantityCell.innerHTML = currentQuantity + quantity;
            const foodCell = existingRow.cells[1];
            foodCell.innerHTML = `${food} (${currentQuantity + quantity})`;
        } else {
            // Create new row for new table/type
            const newRow = unpaidOrdersTable.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);

            cell1.innerHTML = this.selectedTableOrType;
            cell2.innerHTML = `${food} (${quantity})`;
            cell3.innerHTML = quantity;
            cell4.innerHTML = '<button onclick="orderManager.markAsPaid(this)">Thanh Toán</button>';
        }

        // Clear selection and quantity
        document.getElementById('food').value = '';
        document.getElementById('quantity').value = '';
    }

    markAsPaid(button) {
        const row = button.parentNode.parentNode;
        const unpaidOrdersTable = document.getElementById('unpaid-orders').getElementsByTagName('tbody')[0];
        const paidOrdersTable = document.getElementById('paid-orders').getElementsByTagName('tbody')[0];

        // Extract data from the row
        const tableOrType = row.cells[0].innerHTML;
        const food = row.cells[1].innerHTML.split(' (')[0];
        const quantity = parseInt(row.cells[2].innerHTML, 10);
        const price = this.menuList.find(function(item) {
            return item.name === food;
        }).price;
        const totalPrice = price * quantity;

        // Create new row for the paid orders table
        const newRow = paidOrdersTable.insertRow();
        newRow.innerHTML = `
            <td>${tableOrType}</td>
            <td>${food}</td>
            <td>${quantity}</td>
            <td>${totalPrice}</td>
        `;

        // Remove the row from the unpaid orders table
        row.parentNode.removeChild(row);
    }

    addMenuItem() {
        const name = prompt('Nhập tên món ăn:');
        const price = prompt('Nhập giá món ăn:');
        if (name && price && !isNaN(price)) {
            this.menuList.push(new MenuItem(name, parseFloat(price)));
            this.updateMenuList();
            this.populateFoodOptions();
        }
    }

    editMenuItem(button) {
        const row = button.parentNode.parentNode;
        const nameCell = row.cells[0];
        const priceCell = row.cells[1];

        const newName = prompt('Nhập tên món ăn mới:', nameCell.innerHTML);
        const newPrice = prompt('Nhập giá món ăn mới:', priceCell.innerHTML);

        if (newName && newPrice && !isNaN(newPrice)) {
            nameCell.innerHTML = newName;
            priceCell.innerHTML = parseFloat(newPrice);
            this.updateMenuList();
            this.populateFoodOptions();
        }
    }

    deleteMenuItem(button) {
        const row = button.parentNode.parentNode;
        if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
            const name = row.cells[0].innerHTML;
            this.menuList = this.menuList.filter(function(item) {
                return item.name !== name;
            });
            this.updateMenuList();
            this.populateFoodOptions();
            row.parentNode.removeChild(row);
        }
    }

    updateMenuList() {
        const menuListTable = document.getElementById('menu-list').getElementsByTagName('tbody')[0];
        menuListTable.innerHTML = '';

        this.menuList.forEach(function(item) {
            const newRow = menuListTable.insertRow();
            newRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><button class="action-btn" onclick="orderManager.editMenuItem(this)">Sửa</button></td>
                <td><button class="action-btn" onclick="orderManager.deleteMenuItem(this)">Xóa</button></td>
            `;
        });
    }

    populateFoodOptions() {
        const foodSelect = document.getElementById('food');
        foodSelect.innerHTML = '<option value="">Chọn Món Ăn</option>';
        this.menuList.forEach(function(item) {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = item.name;
            foodSelect.appendChild(option);
        });
    }
}

// Create a single instance of OrderManager
const orderManager = new OrderManager();

// Add event listener to the "Add Menu Item" button
document.getElementById('add-menu-item').addEventListener('click', function() {
    orderManager.addMenuItem();
});
