import { prisma } from "@/lib/prisma"
import { UserRole } from "@/types"
import { hash } from "bcryptjs"
import { randomInt } from "crypto"
import { WorkType } from "../generated/prisma"

const users = [
  {
    name: "admin",
    email: "admin@admin.com",
    role: UserRole.ADMIN
},
{
    name: "ishmael_a",
    email: "abuishmaelyusif204@gmail.com",
    role: UserRole.MANAGER
  },
  {
    email: "bernard@example.com",
    name: "Bernard",
    role: UserRole.EMPLOYEE
},
{
    email: "razak@example.com",
    name: "Razak",
    role: UserRole.EMPLOYEE
},
{
    email: "lena@example.com",
    name: "Lena",
    role: UserRole.MANAGER
},
{
    email: "adjoa@example.com",
    name: "Adjoa",
    role: UserRole.MANAGER
},
{
    email: "isaac@example.com",
    name: "Isaac",
    role: UserRole.EMPLOYEE
  }
]

const departments = [
  {
    name: "UI/UX",
    color: "#FF8A65",
    description: "UI/UX and product design department"
  },
  {
    name: "Fullstack",
    color: "#4DB6AC",
    description: "Full-stack and frontend/backend engineering"
  },
  {
    name: "AI & LLM",
    color: "#BA68C8",
    description: "Machine Learning, AI-LLM and Data Science"
  },
  {
    name: "HR",
    color: "#FFD54F",
    description: "Human resources and people operations"
  },
  {
    name: "DevOps",
    color: "#90A4AE",
    description: "QA, DevOps, IT and Support"
  },
  {
    name: "Management",
    color: "#7986CB",
    description: "Project management and leadership"
  },
  {
    name: "Marketing",
    color: "#F06292",
    description: "Marketing, communications and branding"
  }
]

const projects = [
  {
    name: "RGTPortal",
    description: "Employee management system",
    color: "#42A5F5",
    isActive: true
  },
  {
    name: "Trakka",
    description: "Clickup CLone",
    color: "#AB47BC",
    isActive: true
  },
  {
    name: "MobilePay",
    description: "Mobile-first fintech payments app",
    color: "#26C6DA",
    isActive: true
  }
]


const employees = [
  {
    workType: WorkType.HYBRID,
    officeDays: 2,
    preferences: ["Monday", "Thursday"]
  },
  {
    workType: WorkType.ONSITE,
    officeDays: 2,
    preferences: ["Wednesday", "Thursday"]
  },
  {
    workType: WorkType.HYBRID,
    officeDays: 5,
    preferences: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    workType: WorkType.HYBRID,
    officeDays: 2,
    preferences: ["Tuesday", "Friday"]
  }
]



const seed = async () => {
    const t0 = performance.now();
    try{
        await prisma.project.deleteMany();
        await prisma.employee.deleteMany();
        await prisma.department.deleteMany();
        await prisma.user.deleteMany();

        const passwordHash = await hash('demo123', 10)

        const dbUsers = await prisma.user.createManyAndReturn({
            data: users.map((user) => ({
                ...user,
                passwordHash
            }))
        })

        const dbDepartments = await prisma.department.createManyAndReturn({
            data: departments
        })

        const dbProjects = await prisma.$transaction([
            prisma.project.create({  data: projects[0]  }),
            prisma.project.create({  data: projects[1]  }),
            prisma.project.create({  data: projects[2]  }),
        ])

        const dbEmployees = await prisma.$transaction(
            dbUsers
            .filter((u) => u.role !== UserRole.ADMIN)
            .map((user, index) => 
                prisma.employee.create({
                    data: {
                        ...employees[index % employees.length],
                        userId: user.id,
                        departmentId: dbDepartments[index % dbDepartments.length].id,
                        projectId: dbProjects[randomInt(dbProjects.length)].id,
                    }
                })
            )
        )

        const t1 = performance.now();
        console.log(`Seed data inserted successfully. Finished in (${t1-t0} ms). Total of ${dbEmployees.length} employees created`);
    }catch(error){
        console.error("Error seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
}


seed()