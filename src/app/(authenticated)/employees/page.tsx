'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable, TableColumn } from '@/components/common/data-table';



// Employee interface
interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  manager: string;
  workType: 'In Office' | 'Hybrid' | 'Remote';
}

// Work type badge component
const WorkTypeBadge = ({ workType }: { workType: Employee['workType'] }) => {
  const variants = {
    'In Office': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    'Hybrid': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
    'Remote': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[workType]}`}>
      {workType}
    </span>
  );
};

const Employees = () => {
  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Ethan Carter',
      department: 'Engineering',
      role: 'Software Engineer',
      manager: 'Olivia Bennett',
      workType: 'In Office'
    },
    {
      id: '2',
      name: 'Sophia Clark',
      department: 'Product',
      role: 'Product Manager',
      manager: 'Olivia Bennett',
      workType: 'Hybrid'
    },
    {
      id: '3',
      name: 'Liam Foster',
      department: 'Design',
      role: 'UX Designer',
      manager: 'Ava Harper',
      workType: 'Remote'
    },
    {
      id: '4',
      name: 'Isabella Green',
      department: 'Marketing',
      role: 'Marketing Specialist',
      manager: 'Ava Harper',
      workType: 'In Office'
    },
    {
      id: '5',
      name: 'Noah Hill',
      department: 'Sales',
      role: 'Sales Representative',
      manager: 'Olivia Bennett',
      workType: 'Hybrid'
    }
  ]);

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(query.toLowerCase()) ||
      employee.department.toLowerCase().includes(query.toLowerCase()) ||
      employee.role.toLowerCase().includes(query.toLowerCase()) ||
      employee.manager.toLowerCase().includes(query.toLowerCase()) ||
      employee.workType.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    console.log('Add employee clicked');
  };

  // Define table columns with types
  const columns: TableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      className: 'font-medium text-foreground'
    },
    {
      key: 'department',
      header: 'Department',
      accessor: 'department',
      className: 'text-muted-foreground'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      className: 'text-muted-foreground'
    },
    {
      key: 'manager',
      header: 'Manager',
      accessor: 'manager',
      className: 'text-muted-foreground'
    },
    {
      key: 'workType',
      header: 'Work Type',
      accessor: (employee) => <WorkTypeBadge workType={employee.workType} />,
      className: 'text-right'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        </div>
        <Button onClick={handleAddEmployee} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add employee
        </Button>
      </div>

      {/* Employees Table */}
      {/* <Card> */}
        {/* <CardContent className="p-0"> */}
        <DataTable
        data={filteredEmployees}
        columns={columns}
        searchable
        searchPlaceholder="Search employees"
        onSearch={handleSearch}
        className="p-6"
        />
        {/* </CardContent> */}
      {/* </Card> */}
    </div>
  );
};

export default Employees;