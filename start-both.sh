#!/usr/bin/env bash

# function parse_and_pstree() {
#     # Extract PIDs from ps output, skipping the header
#     PIDs=$(awk 'NR > 1 {print $2}' -)
#     # Iterate over each PID and call pstree
#     for pid in $PIDs; do
#         echo "pstree for PID $pid:"
#         pstree $pid
#         echo "-------------------------"
#     done
# }

# Function to handle SIGINT
terminate_processes() {
  echo "Terminating processes..."
  trap - SIGINT SIGTERM  # Remove the trap
  kill 0  # Send SIGTERM to all processes in the current process group
  exit 0  # Exit the script
}

# Set up the trap
# The trap command in Unix-like operating systems is a shell built-in command that allows you to specify commands that will be executed when the shell receives specified signals. Essentially, it lets you "trap" certain signals and run custom handlers for them.
# Signals are a form of software interrupt delivered to a process. They can originate from the operating system, from a user's keyboard input (e.g., pressing Ctrl+C sends the SIGINT signal), or from one process to another.
# Syntax: `trap COMMANDS SIGNALS`
trap terminate_processes SIGINT SIGTERM

# Start the processes
cd ./backend && python main.py &
cd ./frontend && npm run dev &

# Check which process(-trees) got started
# sleep 1
# echo "----------------------"
# ps -j \
#     | awk -v pgid=$$ 'NR==1 || $3 == pgid' \
#     | parse_and_pstree
# echo "----------------------"

# Wait for all child processes
# If wait is executed without any arguments, it waits for all background jobs to finish. After all jobs complete, it returns a zero exit status.
wait
