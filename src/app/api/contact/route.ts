import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 表单验证 schema
const contactSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z.string().min(1, '主题不能为空'),
  message: z.string().min(10, '消息至少需要10个字符'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证表单数据
    const validatedData = contactSchema.parse(body)
    
    // 方案 1: 使用 Resend (推荐)
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'contact@yourdomain.com',
    //   to: 'your@email.com',
    //   subject: `Contact Form: ${validatedData.subject}`,
    //   html: `
    //     <h2>新的联系表单消息</h2>
    //     <p><strong>姓名:</strong> ${validatedData.name}</p>
    //     <p><strong>邮箱:</strong> ${validatedData.email}</p>
    //     <p><strong>主题:</strong> ${validatedData.subject}</p>
    //     <p><strong>消息:</strong></p>
    //     <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
    //   `,
    // })

    // 方案 2: 使用 EmailJS (前端直接调用)
    // 不需要服务端代码

    // 方案 3: 使用 Nodemailer
    // const transporter = nodemailer.createTransporter({...})
    // await transporter.sendMail({...})

    // 临时返回成功 (实际需要配置邮件服务)
    console.log('联系表单提交:', validatedData)
    
    return NextResponse.json({ 
      message: '消息发送成功！我会尽快回复您。' 
    })
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: '发送失败，请稍后重试或直接发送邮件给我。' },
      { status: 500 }
    )
  }
}