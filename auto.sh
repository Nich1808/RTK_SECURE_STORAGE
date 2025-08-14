

read -p "Enter the commit message: "  message

git add .

git commit -m $message

git push origin main
