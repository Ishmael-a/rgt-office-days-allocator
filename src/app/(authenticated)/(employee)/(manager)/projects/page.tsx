"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, Calendar, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import { useDeleteProject, useProjectsQuery } from "@/hooks/use-projects"
import { useEmployeesQuery } from "@/hooks/use-employee"
import {  EmployeeWithUser } from "@/features/employee/types"
import { ProjectWithEmployees } from "@/features/project/types"
import UpsertProjectModal, { InitialProjectData } from "@/components/projects/create-project-modal"
import ConfirmDialog from "@/components/confirm-dialog"

export default function ProjectsPage() {
    const { data: projectsData } = useProjectsQuery({
        query: {
            withEmployees: true
        }
    })
    const deleteProjectMutation = useDeleteProject()
    const projects = useMemo(() => projectsData?.data.data||[], [projectsData])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [initialData, setInitialData] = useState<InitialProjectData|undefined>(undefined)
    const [projectToDelete, setProjectToDelete] = useState<string|undefined>(undefined)
    const toastRef = useRef<string | number | null>(null)

  
    const handleClose = () =>{
      if(initialData){
        setInitialData(undefined)
      } 
      setIsDialogOpen(false)
    }


    const handleEdit = (project: ProjectWithEmployees) => {
      const initData: InitialProjectData = {
        projectId: project.id,
        name: project.name,
        description: project.description || undefined,
        status: project.isActive,
        color: project.color,
        members: project.employees?.map((emp) => ({ label: emp.user.name, value: emp.userId })) || undefined
      }
      setInitialData(initData);
      setIsDialogOpen(true)
    }

    const handleClickDeleteProject = (id: string) => {
      setProjectToDelete(id)
      setIsDeleteDialogOpen(true)
    }

    const handleDelete = async () => {
      // setProjects((prev) => prev.filter((p) => p.id !== projectId))
      try{
        if(projectToDelete) deleteProjectMutation.mutateAsync(projectToDelete) 
        else console.error("Project ID to delete is undefined")
      }catch(err){
        console.error("Failed to delete project", err)
      }
    }

    useEffect(() => {
      if(deleteProjectMutation.isPending){
        toastRef.current = toast.success("Deleting...")
      }else if(toastRef.current){
        toast.dismiss(toastRef.current)
      }

      return () => { 
        if(toastRef.current) toast.dismiss(toastRef.current);
      }
    }, [deleteProjectMutation.isPending])


  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(projects as ProjectWithEmployees[]).map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    {"No Department"}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    project.isActive ? "default" : "outline"
                  }
                  className="items-center flex"
                >
                  {project.isActive? "Active": "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {project._count.employees} members
                </div>
                {project.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {(project.employees as EmployeeWithUser[])?.slice(0, 3).map((member) => (
                  <Badge key={member.userId} variant="outline" className="text-xs">
                    {member?.user.name || "Unknown"}
                  </Badge>
                )) || null}
                {(project.employees?.length || 0) > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(project._count.employees || 0) - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleClickDeleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmDialog  
        onConfirm={handleDelete} 
        open={isDeleteDialogOpen} 
        setIsOpen={() => setIsDeleteDialogOpen(false)} 
        title="Delete Project" 
        description={`Are you sure you want to delete this project`} 
      />
      <UpsertProjectModal initialData={initialData} isOpen={isDialogOpen} onClose={handleClose}/>
    </div>
  )
}
