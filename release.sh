echo='echo -e \n '

echo "---- Make sure that you're running this script from the project root ----"

$echo "---- Performing version bump (leave empty to skip) ----"
read -p "From version: " old_version
read -p "To version: " new_version
sed -i "0,/\"version\": \"$old_version\"/{s/$old_version/$new_version/}" ./package.json

$echo "---- Make sure to have latest installation of vsce ----"
npm install -g @vscode/vsce

$echo "---- Package ----"
npm i
vsce package