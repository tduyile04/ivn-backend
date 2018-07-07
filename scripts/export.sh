input=".env"
while IFS= read -r var
do
  echo "exporting $var";
  export $var;
done < "$input"

echo "..Done exporting \n";
