'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import { DataTable, TableColumn } from '@/components/common/data-table';
import CreateEmployeeModal, { InitialData } from '@/components/employee/create-employee-modal';
import { EmployeeWithUserAndDepartment } from '@/features/employee/types';
import { WorkType } from '@/types';
import { useEmployeesQuery } from '@/hooks/use-employee';



// Work type badge component
const WorkTypeBadge = ({ workType }: { workType: EmployeeWithUserAndDepartment['workType'] }) => {
  const variants = {
    [WorkType.ONSITE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    [WorkType.HYBRID]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
    [WorkType.REMOTE]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[workType]}`}>
      {workType}
    </span>
  );
};

const Employees = () => {
  const [open, setIsOpen] = useState(false)
  const [initialData, setInitialData] = useState<InitialData|undefined>(undefined)
  const { data: employeesData } = useEmployeesQuery(
    {
      query: {
        withDepartment: true,
        withUser: true
      }
    }
  )
  const employees = useMemo(() => employeesData?.data.data.employees || [], [employeesData])

  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithUserAndDepartment[]>(employees);

  const handleClose = () =>{
    if(initialData){
      setInitialData(undefined)
    } 
    setIsOpen(false)
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered:EmployeeWithUserAndDepartment[] = employees.filter((employee:EmployeeWithUserAndDepartment) =>
      employee.user.name.toLowerCase().includes(query.toLowerCase()) ||
      employee.department.name.toLowerCase().includes(query.toLowerCase()) ||
      employee.user.role.toLowerCase().includes(query.toLowerCase()) ||
      employee.department.manager?.name.toLowerCase().includes(query.toLowerCase()) ||
      employee.workType.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setIsOpen(true)
  };
  const handleEditEmployee = (employee: EmployeeWithUserAndDepartment) => {
    const initVal: InitialData = {
      ...employee,
      previousDepartmentId: employee.departmentId,
      preferences: employee.preferences
    }
    setInitialData(initVal)
    setIsOpen(true)
  };

  const columns: TableColumn<EmployeeWithUserAndDepartment>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: (employee) => employee.user.name,
      className: 'font-medium text-foreground'
    },
    {
      key: 'department',
      header: 'Department',
      accessor: (employee) => employee.department.name,
      className: 'text-muted-foreground'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: (employee) => employee.user.role,
      className: 'text-muted-foreground'
    },
    {
      key: 'manager',
      header: 'Manager',
      accessor: (employee) => employee.department.manager?.name || "No Manager",
      className: 'text-muted-foreground'
    },
    {
      key: 'workType',
      header: 'Work Type',
      accessor: (employee) => <WorkTypeBadge workType={employee.workType} />,
      className: 'text-right'
    },
    {
      key: 'action',
      header: 'Action',
      accessor: (employee) => <div className='flex justify-end'>
        <Button onClick={() => handleEditEmployee(employee)} variant={"ghost"} size={"icon"}>
          <Pencil className='w-4 h-4'/>
        </Button>
      </div>,
      className: 'text-right'
    }
  ];

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

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

      <DataTable
        data={filteredEmployees}
        columns={columns}
        searchable
        searchPlaceholder="Search employees"
        onSearch={handleSearch}
        className="p-6"
      />

      <CreateEmployeeModal initialData={initialData} isOpen={open} onClose={handleClose} />
    </div>
  );
};

export default Employees;