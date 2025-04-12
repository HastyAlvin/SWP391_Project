import React, { useEffect, useState } from "react";
import { 
  MdCurrencyExchange, 
  MdProductionQuantityLimits 
} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { get_admin_dashboard_data } from "../../store/reducers/dashboardReducer";
import { Link } from "react-router-dom";
import { 
  Table, 
  Tag, 
  Select, 
  Input, 
  Button, 
  Tooltip, 
  Typography,
  Space 
} from "antd";

const { Text } = Typography;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [sortOption, setSortOption] = useState("dateDesc");
  const [processedData, setProcessedData] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  const { 
    totalSale, 
    totalOrder, 
    totalProduct, 
    recentOrder,
    totalNewCustomers 
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(get_admin_dashboard_data());
  }, [dispatch]);

  useEffect(() => {
    if (recentOrder && recentOrder.length > 0) {
      const paidOrders = recentOrder.filter(
        (order) => order.payment_status === "paid"
      );

      const categorySummary = {};

      paidOrders.forEach((order) => {
        if (!order.products || !Array.isArray(order.products)) return;

        const categories = [...new Set(order.products.map((p) => p?.category).filter(Boolean))];
        
        categories.forEach((category) => {
          if (!categorySummary[category]) {
            categorySummary[category] = {
              category,
              totalPrice: 0,
              latestDate: order.date || order.createdAt
            };
          }
          
          categorySummary[category].totalPrice += order.price;
          
          const currentDate = new Date(order.date || order.createdAt);
          const latestDate = new Date(categorySummary[category].latestDate);
          
          if (currentDate > latestDate) {
            categorySummary[category].latestDate = order.date || order.createdAt;
          }
        });
      });

      const summarizedData = Object.values(categorySummary);

      let sortedData = [...summarizedData];
      switch (sortOption) {
        case "priceAsc":
          sortedData.sort((a, b) => a.totalPrice - b.totalPrice);
          break;
        case "priceDesc":
          sortedData.sort((a, b) => b.totalPrice - a.totalPrice);
          break;
        case "dateAsc":
          sortedData.sort((a, b) => new Date(a.latestDate) - new Date(b.latestDate));
          break;
        case "dateDesc":
          sortedData.sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate));
          break;
        default:
          break;
      }

      setProcessedData(sortedData);
    } else {
      setProcessedData([]);
    }
  }, [recentOrder, sortOption]);

  const calculateTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0 && diffInHours > 0) {
      return `${diffInDays} days ${diffInHours} hours ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hours ago`;
    }
    return "Less than an hour ago";
  };

  const revenueColumns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => index + 1,
      width: 80,
      align: 'center'
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <Tag color="blue">{category}</Tag>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search category"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => {
              setSelectedKeys([]);
              confirm();
            }} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => 
        record.category.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Total Revenue ($)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => <Text strong>${price.toFixed(2)}</Text>,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Last Order",
      key: "lastOrder",
      render: (_, record) => (
        <Tooltip title={new Date(record.latestDate).toLocaleString()}>
          <span>{calculateTimeAgo(record.latestDate)}</span>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(a.latestDate) - new Date(b.latestDate),
    },
  ];

  const recentOrdersColumns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_, __, index) => index + 1,
      width: 80,
      align: 'center'
    },
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => `#${id}`,
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Payment Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Unpaid', value: 'unpaid' },
      ],
      onFilter: (value, record) => record.payment_status === value,
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'delivery_status',
      key: 'delivery_status',
      render: (status) => (
        <Tag color={
          status === 'delivered' ? 'green' : 
          status === 'cancelled' ? 'red' : 'blue'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link to={`/admin/dashboard/order/details/${record._id}`}>
          <Button type="link">View</Button>
        </Link>
      ),
    },
  ];

  const filteredData = processedData.filter(item =>
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        <DashboardCard
          title="Total Sales"
          value={`$${totalSale}`}
          icon={<MdCurrencyExchange />}
          bgColor="bg-[#fae8e8]"
          iconBg="bg-[#fa0305]"
        />
        <DashboardCard
          title="Products"
          value={totalProduct}
          icon={<MdProductionQuantityLimits />}
          bgColor="bg-[#fde2ff]"
          iconBg="bg-[#760077]"
        />
        <DashboardCard
          title="New Registered Customers"
          value={totalNewCustomers}
          icon={<FaUsers />}
          bgColor="bg-[#e9feea]"
          iconBg="bg-[#038000]"
        />
        <DashboardCard
          title="Successful orders in last 7 days"
          value={totalOrder}
          icon={<FaCartShopping />}
          bgColor="bg-[#ecebff]"
          iconBg="bg-[#0200f8]"
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <div className="w-full md:w-[48%] p-4 bg-[#FFFFFF] rounded-md">
          <h2 className="font-semibold text-lg text-[#000000] pb-3">
            Recent Orders
          </h2>
          <Table
            columns={recentOrdersColumns}
            dataSource={recentOrder}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            bordered
            scroll={{ x: true }}
          />
        </div>

        <div className="w-full md:w-[48%] p-4 bg-[#FFFFFF] rounded-md">
          <div className="flex justify-between items-center pb-3">
            <h2 className="font-semibold text-lg text-[#000000]">
              Revenue by Product Categories (Paid Orders)
            </h2>
            <Select
              defaultValue="dateDesc"
              style={{ width: 200 }}
              onChange={setSortOption}
              options={[
                { value: "dateDesc", label: "Newest First" },
                { value: "dateAsc", label: "Oldest First" },
                { value: "priceDesc", label: "Highest Revenue First" },
                { value: "priceAsc", label: "Lowest Revenue First" },
              ]}
            />
          </div>
          <Table
            columns={revenueColumns}
            dataSource={filteredData}
            rowKey="category"
            pagination={{ pageSize: 5 }}
            loading={!processedData}
            bordered
            scroll={{ x: true }}
            locale={{
              emptyText: (
                <div className="text-center py-4">
                  <p>No paid orders found</p>
                  <p className="text-sm text-gray-500">
                    {recentOrder?.length ? `${recentOrder.length} orders found but none are paid` : 'No orders available'}
                  </p>
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, bgColor, iconBg }) => (
  <div
    className={`flex justify-between items-center p-5 ${bgColor} rounded-md gap-3`}
  >
    <div className="flex flex-col text-[#5c5a5a]">
      <h2 className="text-3xl font-bold">{value}</h2>
      <span className="text-md font-medium">{title}</span>
    </div>
    <div
      className={`w-[40px] h-[47px] rounded-full ${iconBg} flex justify-center items-center text-xl text-white`}
    >
      {icon}
    </div>
  </div>
);

export default AdminDashboard;