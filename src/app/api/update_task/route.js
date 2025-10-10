import { prisma } from '@/lib/prisma'

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = Buffer.from(payload, 'base64url').toString('utf8'); // Node 16+
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const normDate = (v) => (v ? new Date(v) : null)
const sameDate = (a, b) => {
  const da = normDate(a), db = normDate(b)
  if (!da && !db) return true
  if (!da || !db) return false
  // compare date-only (YYYY-MM-DD)
  return da.toISOString().slice(0, 10) === db.toISOString().slice(0, 10)
}
const numOrNull = (v) => (v === null || v === undefined || v === '' ? null : Number(v))

export async function PUT(req) {

  try {
    const body = await req.json();
    const {
      t_id,              // Task ID to update
      t_title,
      start_date,
      t_description,
      due_date,
      time_estimate,
      priority,
      task_status_id,
      parent_task_id,
      assigns
    } = body;

    console.log("Task to update:", body);

    const token = req.cookies.get('token')?.value;
    const claims = token ? decodeJwt(token) : null;

    const current = await prisma.task.findUnique({
      where: { t_id },
      include: {
        user_tasks: { select: { assigned_to_id: true } },
      },
    })
    if (!current) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    console.log("existing task: ", current);

    let content = "";

    if (t_title !== undefined && t_title !== current.t_title) { content = `changed the task title (${t_title}).` }
    if (t_description !== undefined && t_description !== current.t_description) { content = `changed the task description (${t_description}).` }
    if (due_date !== undefined && !sameDate(due_date, current.due_date)) { content = `set due dates to ${due_date}` }
    if (time_estimate !== undefined && numOrNull(time_estimate) !== current.time_estimate) { content = `estimated the time (${time_estimate}).` }
    if (priority !== undefined && numOrNull(priority) !== current.priority) { content = `set the priority as ${priority}` }
    if (task_status_id !== undefined && task_status_id !== current.task_status_id) { content = `changed the task status (${task_status_id}).` }
    if (start_date !== undefined && !sameDate(start_date, current.start_date)) {content = `set the start time (${start_date}).`}

    // 1. Update Task
    const updatedTask = await prisma.task.update({
      where: { t_id },
      data: {
        t_title,
        t_description,
        due_date,
        time_estimate,
        priority,
        task_status_id,
        start_date
      },
    });

    console.log('Task Updated:', updatedTask);

    if (content !== "") {
      const addActivity = await prisma.activity.create({
        data: {
          done_by_id: claims.userId,
          related_task_id: t_id,
          content: content,
          date: new Date()
        },
      })
      if(addActivity) console.log("Activity created!!");
    }

    return new Response(JSON.stringify({ message: 'Task updated', task: updatedTask }), { status: 200 });

  } catch (err) {
    console.error('Error updating task:', err);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), { status: 500 });
  }
}
