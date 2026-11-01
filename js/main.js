// 1. Tạo khung SVG container riêng cho biểu đồ cột với viewBox lớn hơn để có không gian cho lề (margins)
const svg = d3.select(".bar-chart-container")
    .append("svg")
      .attr("viewBox", "0 0 600 850")
      .style("border", "1px solid #ccc")
      .style("background-color", "#fafafa"); // Thêm màu nền nhẹ cho sang trọng

// 2. Định nghĩa hàm drawBarChart hoàn thiện với chi tiết tối ưu
function drawBarChart(data) {
    console.log("Dữ liệu chi tiết truyền vào drawBarChart:", data);

    // Thiết lập lề (Margin convention) chuẩn trong D3.js để không bị tràn chữ
    const margin = { top: 60, right: 60, bottom: 40, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 850 - margin.top - margin.bottom;

    // Tạo một nhóm chính (g) chứa toàn bộ biểu đồ đã được dịch chuyển theo lề
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Thêm tiêu đề cho biểu đồ (Chart Title)
    svg.append("text")
        .attr("x", 600 / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text("Thống kê số lượng Tivi theo từng hãng (TV Brand Count)");

    // Khai báo Linear Scale cho trục X (dữ liệu số lượng count)
    const xScale = d3.scaleLinear()
        .domain([0, 1200])
        .range([0, width]);

    // Khai báo Band Scale cho trục Y (danh mục thương hiệu brand) với padding thoáng hơn
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, height])
        .padding(0.25);

    // Tạo nhóm g (barAndLabel) kết hợp thanh cột và nhãn di chuyển cùng nhau theo yScale
    const barAndLabel = chartGroup
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    // Thêm các hình chữ nhật (rect) với hiệu ứng bo góc nhẹ hoặc màu sắc bắt mắt
    barAndLabel
        .append("rect")
        .attr("width", d => xScale(d.count))
        .attr("height", yScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("rx", 3) // Bo tròn nhẹ góc của thanh cột
        .attr("ry", 3)
        .attr("x", 0)
        .attr("y", 0);

    // Thêm nhãn tên hãng tivi (brand text) bên trái cột với căn chỉnh hoàn hảo
    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", -15)                         // Khoảng cách lùi về bên trái cột
        .attr("y", yScale.bandwidth() / 2 + 4)  // Căn giữa theo chiều dọc của thanh cột
        .attr("text-anchor", "end")             // Căn lề phải chuẩn xác
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("fill", "#222");

    // Thêm con số giá trị cụ thể (count number) ở đuôi bên phải cột
    barAndLabel
        .append("text")
        .text(d => d.count)
        .attr("x", d => xScale(d.count) + 8)    // Cách đuôi cột một khoảng nhỏ
        .attr("y", yScale.bandwidth() / 2 + 4)  // Căn giữa theo chiều dọc
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "#444");
}

// 3. Đọc file CSV, ép kiểu dữ liệu và kích hoạt hàm vẽ
d3.csv("../data/tvBrandCount.csv", d => {
    return {
        brand: d.brand,       
        count: +d.count       
    };
}).then(data => {
    console.log("Toàn bộ mảng dữ liệu đã nạp:", data);
    console.log("Giá trị lớn nhất của count:", d3.max(data, d => d.count));
    console.log("Giá trị nhỏ nhất của count:", d3.min(data, d => d.count));

    drawBarChart(data);
});